// Gofile.io API configuration
const GOFILE_API_URL = 'https://api.gofile.io';

export const uploadFileToGofile = async (file: File): Promise<{ fileId: string; fileName: string; fileUrl: string }> => {
  try {
    // Upload directly to GoFile without getting server first
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch('https://store4.gofile.io/uploadFile', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('GoFile API Response:', uploadData); // For debugging

    if (uploadData.status !== 'ok' || !uploadData.data) {
      throw new Error('Upload failed: ' + JSON.stringify(uploadData));
    }

    return {
      fileId: uploadData.data.fileId || uploadData.data.id,
      fileName: uploadData.data.fileName || uploadData.data.name,
      fileUrl: uploadData.data.downloadPage || uploadData.data.url
    };
  } catch (error) {
    console.error('Error in uploadFileToGofile:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export const deleteGofileFile = async (fileId: string) => {
  const deleteUrl = 'https://api.gofile.io/deleteContent';
  const formData = new FormData();
  formData.append('contentsId', fileId);
  formData.append('token', "ADcGHPd8aWmNV0h2Sxr5rEeEDFYLyTFW");

  try {
    const response = await fetch(deleteUrl, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.status === 'ok') {
      console.log(`File ${fileId} deleted from GoFile.`);
    } else {
      throw new Error(`Failed to delete file from GoFile: ${data.status}`);
    }
  } catch (error) {
    console.error('Error deleting file from GoFile:', error);
    throw error;
  }
};
