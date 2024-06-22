export const uriToBlob = async (uri: string) => {
  const response = await fetch(uri);
  const blobFile = await response.blob();

  return blobFile;
};
