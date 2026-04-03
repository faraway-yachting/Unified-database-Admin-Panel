"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface ImageResizeHandlesProps {
  imgElement: HTMLImageElement
  parentContainerRef: React.RefObject<HTMLElement>
  onResize: () => void
  onDeselect: () => void
}

const ImageResizeHandles: React.FC<ImageResizeHandlesProps> = ({
  imgElement,
  parentContainerRef,
  onResize,
  onDeselect,
}) => {
  const [overlay, setOverlay] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const isResizing = useRef(false)
  const activeHandle = useRef<string | null>(null)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const syncOverlay = useCallback(() => {
    if (!imgElement || !parentContainerRef.current) return
    const imgRect = imgElement.getBoundingClientRect()
    const parentRect = parentContainerRef.current.getBoundingClientRect()
    setOverlay({
      top: imgRect.top - parentRect.top + parentContainerRef.current.scrollTop,
      left: imgRect.left - parentRect.left + parentContainerRef.current.scrollLeft,
      width: imgRect.width,
      height: imgRect.height,
    })
  }, [imgElement, parentContainerRef])

  useEffect(() => {
    syncOverlay()
    imgElement.style.outline = "2px solid #3b82f6"
    imgElement.style.cursor = "default"

    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target !== imgElement) onDeselect()
    }
    document.addEventListener("mousedown", handleGlobalClick)
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick)
      imgElement.style.outline = ""
      imgElement.style.cursor = ""
    }
  }, [imgElement, onDeselect, syncOverlay])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.preventDefault()
      e.stopPropagation()
      isResizing.current = true
      activeHandle.current = handle
      startX.current = e.clientX
      startWidth.current = imgElement.offsetWidth
    },
    [imgElement],
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !activeHandle.current) return
      const dx = e.clientX - startX.current
      const newWidth = Math.max(50, activeHandle.current.includes("right")
        ? startWidth.current + dx
        : startWidth.current - dx)
      const aspect = imgElement.naturalHeight / imgElement.naturalWidth
      imgElement.style.width = `${newWidth}px`
      imgElement.style.height = `${newWidth * aspect}px`
      syncOverlay()
    }
    const onMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        activeHandle.current = null
        onResize()
      }
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [imgElement, onResize, syncOverlay])

  const handles = [
    { id: "top-left",     cursor: "nwse-resize", top: -5, left: -5 },
    { id: "top-right",    cursor: "nesw-resize", top: -5, left: overlay.width - 5 },
    { id: "bottom-left",  cursor: "nesw-resize", top: overlay.height - 5, left: -5 },
    { id: "bottom-right", cursor: "nwse-resize", top: overlay.height - 5, left: overlay.width - 5 },
  ]

  return (
    <div
      className="absolute pointer-events-none border-2 border-blue-500"
      style={{ top: overlay.top, left: overlay.left, width: overlay.width, height: overlay.height }}
    >
      {handles.map((h) => (
        <div
          key={h.id}
          className="absolute w-3 h-3 bg-blue-500 border border-white rounded-sm pointer-events-auto"
          style={{ top: h.top, left: h.left, cursor: h.cursor }}
          onMouseDown={(e) => handleMouseDown(e, h.id)}
        />
      ))}
    </div>
  )
}

export default ImageResizeHandles
