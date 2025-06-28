import { LeafBoundsHelper } from '@leafer/helper'
import { ILeaferCanvas, IRenderOptions, IBranchRenderModule } from '@leafer/interface'


const { excludeRenderBounds } = LeafBoundsHelper

export const BranchRender: IBranchRenderModule = {

    __updateChange(): void {
        const { __layout: layout } = this
        if (layout.childrenSortChanged) {
            this.__updateSortChildren()
            layout.childrenSortChanged = false
        }

        this.__.__checkSingle()
    },


    __render(canvas: ILeaferCanvas, options: IRenderOptions): void {

        this.__nowWorld = this.__getNowWorld(options)

        if (this.__worldOpacity) {

            const data = this.__

            if (data.dim) options.dimOpacity = data.dim === true ? 0.2 : data.dim
            else if (data.dimskip) options.dimOpacity && (options.dimOpacity = 0)

            if (data.__single && !this.isBranchLeaf) { // Frame / Box 不能走 single 逻辑渲染组，需用 drawAfterFill 渲染成一个整体， 关联设置 BoxData.__drawAfterFill

                if (data.eraser === 'path') return this.__renderEraser(canvas, options)

                const tempCanvas = canvas.getSameCanvas(false, true)

                this.__renderBranch(tempCanvas, options)

                const nowWorld = this.__nowWorld

                canvas.opacity = options.dimOpacity ? data.opacity * options.dimOpacity : data.opacity
                canvas.copyWorldByReset(tempCanvas, nowWorld, nowWorld, data.__blendMode, true)

                tempCanvas.recycle(nowWorld)

            } else {

                this.__renderBranch(canvas, options)

            }

        }

    },

    __renderBranch(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__hasMask) {

            this.__renderMask(canvas, options)

        } else {

            const { children } = this
            for (let i = 0, len = children.length; i < len; i++) {
                excludeRenderBounds(children[i], options) || children[i].__render(canvas, options)
            }

        }
    },


    __clip(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__worldOpacity) {
            const { children } = this
            for (let i = 0, len = children.length; i < len; i++) {
                excludeRenderBounds(children[i], options) || children[i].__clip(canvas, options)
            }
        }
    }
}