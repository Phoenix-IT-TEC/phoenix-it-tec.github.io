import { MediaPlatformImage } from '@wix/members-domain-ts';

import { HttpClient } from '../../types/controller';

interface UploadFileOptions {
  uploadUrl: string;
  uploadToken: string;
  fileName: string;
  fileDataUrl: string;
}

const mediaType = 'picture';

const membersAreaFolder = 'Members Area';

const visitorsUploadsFolderId = 'visitor-uploads';

export class MediaService {
  constructor(private readonly httpClient: HttpClient) {}

  readonly uploadPicture = async ({
    uploadUrl,
    uploadToken,
    fileName,
    fileDataUrl,
  }: UploadFileOptions) => {
    const formData = new FormData();
    const blob = await this.dataUrlToBlob(fileDataUrl);

    formData.append('directory', membersAreaFolder);
    formData.append('parent_folder_id', visitorsUploadsFolderId);
    formData.append('upload_token', uploadToken);
    formData.append('media_type', mediaType);
    formData.append('file', blob, fileName);

    const { data } = await this.httpClient.post<MediaPlatformImage[]>(
      uploadUrl,
      formData,
    );
    const { width, height, file_name, original_file_name } = data[0];

    return { width, height, file_name, original_file_name };
  };

  private readonly dataUrlToBlob = (url: string) =>
    this.httpClient
      .get<Blob>(url, {
        responseType: 'blob',
      })
      .then(({ data }) => data);
}
