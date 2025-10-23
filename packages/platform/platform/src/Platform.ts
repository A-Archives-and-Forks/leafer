import { IPlatform, IObject, IBoundsData, ICanvasPattern, IMatrixData, ILeaferImagePatternPaint, ISizeData, ICanvasContext2D } from '@leafer/interface'
import { DataHelper } from '@leafer/data'


const { floor, max } = Math

export const Platform: IPlatform = {
    toURL(text: string, fileType?: 'text' | 'svg'): string {
        let url = encodeURIComponent(text)
        if (fileType === 'text') url = 'data:text/plain;charset=utf-8,' + url
        else if (fileType === 'svg') url = 'data:image/svg+xml,' + url
        return url
    },
    image: {
        hitCanvasSize: 100,
        maxCacheSize: 2560 * 1600,  // 2k
        maxPatternSize: 4096 * 2160, // 4k
        crossOrigin: 'anonymous',
        isLarge(size: ISizeData, scaleX?: number, scaleY?: number): boolean {
            return size.width * size.height * (scaleX ? scaleX * scaleY : 1) > Platform.image.maxCacheSize
        },
        getRealURL(url: string): string {
            const { prefix, suffix } = Platform.image
            if (suffix && !url.startsWith('data:') && !url.startsWith('blob:')) url += (url.includes("?") ? "&" : "?") + suffix
            if (prefix && url[0] === '/') url = prefix + url
            return url
        },
        resize(image: any, width: number, height: number, xGap?: number, yGap?: number, clip?: IBoundsData, smooth?: boolean, opacity?: number, _filters?: IObject): any {
            const canvas = Platform.origin.createCanvas(max(floor(width + (xGap || 0)), 1), max(floor(height + (yGap || 0)), 1),)
            const ctx: ICanvasContext2D = canvas.getContext('2d')
            if (opacity) ctx.globalAlpha = opacity
            ctx.imageSmoothingEnabled = smooth === false ? false : true // 平滑绘制
            if (clip) {
                const scaleX = width / clip.width, scaleY = height / clip.height
                ctx.setTransform(scaleX, 0, 0, scaleY, -clip.x * scaleX, -clip.y * scaleY)
                ctx.drawImage(image, 0, 0, image.width, image.height)
            } else ctx.drawImage(image, 0, 0, width, height)
            return canvas
        },
        setPatternTransform(pattern: ICanvasPattern, transform?: IMatrixData, paint?: ILeaferImagePatternPaint): void {
            try {
                if (transform && pattern.setTransform) {
                    pattern.setTransform(transform) // maybe error 
                    transform = undefined
                }
            } catch { }
            if (paint) DataHelper.stintSet(paint, 'transform', transform)
        }
    }
}