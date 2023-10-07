const crypto = require('crypto');
const jwt = require('jsonwebtoken');
import * as openpgp from 'openpgp';

export default {
  async generateChallenge(ctx, next) {
    try {
      const challenge = crypto.randomBytes(32).toString('hex');
      ctx.session.challenge = challenge; // Save challenge in session for later verification
      ctx.send({ challenge });
      await next();
    } catch (err) {
      ctx.body = err;
    }
  },
  async validateChallenge(ctx, next) {
    const { signedChallenge, uuid } = ctx.request.body;

    // Fetch conversation from database
    const conversation = await strapi.entityService.findMany( "api::conversation.conversation",
    {
      fields: 'publicKey',
      filters: {
        uuid,
      },
    });

    const publicKey = conversation?.[0]?.publicKey;

    // Fetch challenge from session
    const challenge = ctx.session.challenge;

    if (!challenge) {
      return ctx.badRequest('No challenge generated');
    }

    if (!publicKey) {
      return ctx.badRequest('No public key found');
    }

    // Verify the signed challenge
    const verified = await verifySignature(signedChallenge, challenge, publicKey);

    if (verified) {
      const token = jwt.sign({ id: uuid }, process.env.JWT_SECRET, { expiresIn: '1h' });
      ctx.send({ verified: true, token });
      await next();
    } else {
      return ctx.badRequest('Verification failed');
    }
  }
};

async function verifySignature(signedMessage, originalMessage, publicKey) {
  const verification = await openpgp.verify({
    message: await openpgp.readCleartextMessage({ cleartextMessage: signedMessage }),
    verificationKeys: await openpgp.readKey({ armoredKey: publicKey }),
  });

  const valid = await verification.signatures[0]?.verified;
  if (valid) {
    const decodedMessage = verification.data;
    return decodedMessage === originalMessage;
  } else {
    return false;
  }
}
