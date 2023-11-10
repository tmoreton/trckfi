// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import cloudinary from 'cloudinary'

// Return "https" URLs by setting secure: true
cloudinary.v2.config({
  cloud_name: 'dd2svpjuq', 
  api_key: '761558456525313', 
  api_secret: 'krCtzuooCdIH3LkmSgiBab9VWfs',
  secure: true
});
export default async (req, res) => {
  const { file } = req.body
  try {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    const result = await cloudinary.v2.uploader.upload(file, options);
    return result.public_id;
  } catch (e) {
    console.error(e)
    // slackMessage('Error update_user: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}