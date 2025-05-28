// Gofile.io API configuration
const GOFILE_ACCOUNT_ID = import.meta.env.VITE_GOFILE_ACCOUNT_ID || '81df073f-ee7a-4439-9f3e-3927adf1a356';
const GOFILE_ACCOUNT_TOKEN = import.meta.env.VITE_GOFILE_ACCOUNT_TOKEN || 'ADCgHPd8aWmNV0h2Sxr5rEeEDFYLyTFW';

// Lecture Management Functions
export const uploadFileToGofile = async (file: File): Promise<{ fileId: string; fileName: string; fileUrl: string }> => {
  const uploadUrl = `https://upload.gofile.io/uploadFile`; // Use global upload endpoint

  const formData = new FormData();
  formData.append('file', file);
  formData.append('accountId', GOFILE_ACCOUNT_ID);
  formData.append('token', GOFILE_ACCOUNT_TOKEN);

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json(); // Assume JSON response
    if (data.status === 'ok') {
      const fileId = data.data.id; // Use 'id' for fileId
      const fileName = data.data.name; // Use 'name' for fileName
      const fileUrl = data.data.downloadPage; // Use 'downloadPage' for fileUrl
      return { fileId, fileName, fileUrl };
    } else {
      console.error('Gofile upload failed with status:', data.status, 'Data:', data);
      throw new Error(`Failed to upload file to Gofile: ${data.status}`);
    }
  } catch (error) {
    console.error('Error uploading file to Gofile:', error);
    throw error;
  }
};

export const deleteGofileFile = async (fileId: string) => {
  const deleteUrl = 'https://api.gofile.io/deleteContent';
  const formData = new FormData();
  formData.append('contentsId', fileId);
  formData.append('token', GOFILE_ACCOUNT_TOKEN);

  try {
    const response = await fetch(deleteUrl, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.status === 'ok') {
      console.log(`File ${fileId} deleted from Gofile.`);
    } else {
      throw new Error(`Failed to delete file from Gofile: ${data.status}`);
    }
  } catch (error) {
    console.error('Error deleting file from Gofile:', error);
    throw error;
  }
};
