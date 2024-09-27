const WIX_IMAGES_HOST = 'static.wixstatic.com';
const DEFAULT_SIZE = 1000;
const DEFAULT_QUALITY = 80;
export class ImageService {
    constructor() {
        this.resize = (w, h, rw, rh) => {
            if (rw > w && rh > h) {
                return {
                    width: w,
                    height: h,
                };
            }
            return {
                width: rw,
                height: rh,
            };
        };
        this.isImageObject = (parameter) => !!parameter && !!parameter.file_name;
        this.getImageUrl = (properties) => {
            const { image, rw = DEFAULT_SIZE, rh = DEFAULT_SIZE, quality = DEFAULT_QUALITY, } = properties;
            if (typeof image === 'string') {
                return image;
            }
            if (this.isImageObject(image)) {
                const { file_name: fileName, width: w, height: h } = image;
                const { width, height } = this.resize(w, h, rw, rh);
                return `https://${WIX_IMAGES_HOST}/media/${fileName}/v1/fit/w_${width},h_${height},al_c,q_${quality}/file.jpg`;
            }
            return '';
        };
    }
}
//# sourceMappingURL=image.js.map