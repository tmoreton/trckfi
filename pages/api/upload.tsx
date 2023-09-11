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
    console.log(file)
    const result = await cloudinary.v2.uploader.upload(file, options);
    console.log(result);
    return result.public_id;
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    // slackMessage('Error update_user: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}