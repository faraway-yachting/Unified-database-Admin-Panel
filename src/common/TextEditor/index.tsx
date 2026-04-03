"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Table,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Indent,
  Outdent,
  Minus,
  ImageIcon,
} from "lucide-react";
import { Button } from "./Button";
import { Separator } from "./Separator";
import ImageResizeHandles from "./Image"; 
import TableContextMenu from "./Table"; 
import { useTheme } from "@/context/ThemeContext";

interface TableDimensions {
  rows: number
  cols: number
}

type RichTextEditorOneProps = {
  value?: string
  onChange: (content: string) => void
  onImageUpload?: (file: File) => Promise<string>
}

const RichTextEditor: React.FC<RichTextEditorOneProps> = ({ value = "", onChange, onImageUpload }) => {
  const { colors } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const [showTableSelector, setShowTableSelector] = useState(false)
  const [editorContent, setEditorContent] = useState<string>(value ?? "")
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null) // State for selected image
  const lastSelectionRange = useRef<Range | null>(null) // Ref to store the last selection
  const isUpdatingRef = useRef(false) // Ref to prevent infinite loops
  const isExternalUpdateRef = useRef(false) // Ref to track value-prop-driven updates (skip onChange)

  // State for table context menu
  const [showTableContextMenu, setShowTableContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const contextMenuTargetCell = useRef<HTMLTableCellElement | null>(null) // Store the cell that was right-clicked

  // Initialize editor content from value prop
  useEffect(() => {
     if (editorRef.current && editorRef.current.innerHTML !== value && !isUpdatingRef.current) {
      isExternalUpdateRef.current = true
      editorRef.current.innerHTML = value
      setEditorContent(value)
    }
  }, [value])

  // Report content changes via onChange prop
  useEffect(() => {
    // Skip if this update came from the value prop (not user input)
    if (isExternalUpdateRef.current) {
      isExternalUpdateRef.current = false
      return
    }
    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true
      onChange(editorContent)
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    }
    // We intentionally omit 'onChange' from the dependency array to prevent infinite loops
    // If 'onChange' ever changes, ensure it is memoized in the parent component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorContent])

  // Function to save the current selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      lastSelectionRange.current = selection.getRangeAt(0)
    } else {
      lastSelectionRange.current = null
    }
  }, [])

  // Function to restore the saved selection
  const restoreSelection = useCallback(() => {
    if (lastSelectionRange.current && editorRef.current) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(lastSelectionRange.current)
        editorRef.current.focus() // Ensure editor is focused after restoring selection
      }
    }
  }, [])

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      // Restore selection before executing command, especially for toolbar interactions
      restoreSelection()

      document.execCommand(command, false, value)
      editorRef.current?.focus()
      // Update content state after command execution
      if (editorRef.current) {
        setEditorContent(editorRef.current.innerHTML)
      }
    },
    [restoreSelection],
  )

  // Helper function to get all selected table cells
  const getSelectedTableCells = useCallback(
    (selection: Selection, editorElement: HTMLDivElement): HTMLTableCellElement[] => {
      const cells: HTMLTableCellElement[] = []
      if (!selection || selection.rangeCount === 0) return cells

      const range = selection.getRangeAt(0)

      // Find the actual start and end TD elements
      let startCell: HTMLTableCellElement | null = null
      let endCell: HTMLTableCellElement | null = null

      let node: Node | null = range.startContainer
      while (node && node !== editorElement) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "TD") {
          startCell = node as HTMLTableCellElement
          break
        }
        node = node.parentNode
      }

      node = range.endContainer
      while (node && node !== editorElement) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "TD") {
          endCell = node as HTMLTableCellElement
          break
        }
        node = node.parentNode
      }

      if (!startCell && !endCell) {
        return cells // No table cells involved in selection
      }

      // If only one cell is selected (collapsed or within a single cell)
      if (startCell && (!endCell || startCell === endCell)) {
        cells.push(startCell)
        return cells
      }

      // If multiple cells are selected
      if (startCell && endCell && startCell.closest("table") === endCell.closest("table")) {
        const table = startCell.closest("table")
        if (!table) return cells

        const rows = Array.from(table.querySelectorAll("tr"))
        let startRowIndex = -1,
          startColIndex = -1
        let endRowIndex = -1,
          endColIndex = -1

        // Find indices of start and end cells
        rows.forEach((row, rIdx) => {
          const rowCells = Array.from(row.querySelectorAll("td"))
          rowCells.forEach((cell, cIdx) => {
            if (cell === startCell) {
              startRowIndex = rIdx
              startColIndex = cIdx
            }
            if (cell === endCell) {
              endRowIndex = rIdx
              endColIndex = cIdx
            }
          })
        })

        if (startRowIndex === -1 || endRowIndex === -1) return cells // Should not happen if startCell/endCell are found

        // Determine the bounding box of selected cells
        const minRow = Math.min(startRowIndex, endRowIndex)
        const maxRow = Math.max(startRowIndex, endRowIndex)
        const minCol = Math.min(startColIndex, endColIndex)
        const maxCol = Math.max(startColIndex, endColIndex)

        // Iterate through all cells in the table and add those within the bounding box
        rows.forEach((row, rIdx) => {
          if (rIdx >= minRow && rIdx <= maxRow) {
            const rowCells = Array.from(row.querySelectorAll("td"))
            rowCells.forEach((cell, cIdx) => {
              if (cIdx >= minCol && cIdx <= maxCol) {
                cells.push(cell)
              }
            })
          }
        })
      }

      return Array.from(new Set(cells)) // Ensure uniqueness
    },
    [],
  )

  // Function to apply shading to selected table cells
  const applyCellShading = useCallback(
    (color: string) => {
      restoreSelection()
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || !editorRef.current) return

      const selectedCells = getSelectedTableCells(selection, editorRef.current)

      selectedCells.forEach((cell) => {
        cell.style.backgroundColor = color
      })

      editorRef.current.focus()
      setEditorContent(editorRef.current.innerHTML)
    },
    [restoreSelection, getSelectedTableCells],
  )

  const handleBackColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value
      restoreSelection() // Always restore selection first

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0 && editorRef.current) {
        const selectedCells = getSelectedTableCells(selection, editorRef.current)
        if (selectedCells.length > 0) {
          applyCellShading(color)
        } else {
          executeCommand("backColor", color)
        }
      } else {
        // Fallback if no selection (e.g., editor not focused)
        executeCommand("backColor", color)
      }
    },
    [restoreSelection, getSelectedTableCells, applyCellShading, executeCommand],
  )

  const insertTable = useCallback((dimensions: TableDimensions) => {
    if (!editorRef.current) {
      console.error("Editor ref is null, cannot insert table.")
      return
    }

    editorRef.current.focus() // Ensure editor is focused to get a valid selection

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      console.error("No valid selection available after focusing editor.")
      return
    }

    // Create the table HTML
    let tableHTML = `
    <table style="border-collapse: collapse; width: 100%; border: 1px solid black;">
      <tbody>
  `
    for (let i = 0; i < dimensions.rows; i++) {
      tableHTML += "<tr>"
      for (let j = 0; j < dimensions.cols; j++) {
        tableHTML += `
        <td style="
          border: 1px solid #666; 
          padding: 12px; 
          min-height: 40px;
          vertical-align: top;
        " contenteditable="true">
          <br>
        </td>
      `
      }
      tableHTML += "</tr>"
    }
    tableHTML += `
      </tbody>
    </table>
  `

    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = tableHTML
    const tableElement = tempDiv.querySelector("table")

    if (tableElement) {
      const tableWrapper = document.createElement("div")
      tableWrapper.style.cssText = "overflow-x: auto; max-width: 100%;"
      tableWrapper.appendChild(tableElement)

      // Always append the table to the end of the editor content
      editorRef.current.appendChild(tableWrapper)

      // Ensure there's a new paragraph after the table for continued typing
      const newParagraph = document.createElement("p")
      newParagraph.innerHTML = "<br>"
      editorRef.current.appendChild(newParagraph)

      // Place cursor in the first cell of the new table
      const firstCell = tableElement.querySelector("td")
      if (firstCell) {
        const newRange = document.createRange()
        newRange.selectNodeContents(firstCell)
        newRange.collapse(true)
        selection!.removeAllRanges()
        selection!.addRange(newRange)
      } else {
        // Fallback: place cursor in the new paragraph after the table
        const newRange = document.createRange()
        newRange.selectNodeContents(newParagraph)
        newRange.collapse(true)
        selection!.removeAllRanges()
        selection!.addRange(newRange)
      }

      editorRef.current.focus()
      // Remove setEditorContent call to prevent infinite loops
      // setEditorContent(editorRef.current.innerHTML)
    } else {
      console.error("Failed to create table element from HTML string.")
    }

    setShowTableSelector(false)
  }, [])

  const insertQuickTable = useCallback(() => {
    insertTable({ rows: 3, cols: 3 })
  }, [insertTable])

  const insertBulletList = useCallback(() => {
    if (!editorRef.current) return

    restoreSelection() // Ensure selection is restored before acting

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // Fallback if restoreSelection didn't yield a range
      editorRef.current.focus()
      const newRange = document.createRange()
      newRange.selectNodeContents(editorRef.current)
      newRange.collapse(false) // Collapse to end
      selection?.removeAllRanges()
      selection?.addRange(newRange)
    }

    const range = selection!.getRangeAt(0)

    if (!selection!.isCollapsed) {
      // Case 1: Text is selected - convert each line/paragraph into a list item
      const selectedContent = range.extractContents() // Extract selected content

      const tempDiv = document.createElement("div")
      tempDiv.appendChild(selectedContent)

      const newList = document.createElement("ul")
      newList.style.cssText = "margin: 15px 0; padding-left: 30px; list-style-type: disc;" // Standard disc bullet

      // Process children of the extracted content
      Array.from(tempDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== "") {
          // Handle plain text nodes as individual list items, splitting by newlines
          const lines = node.textContent!.split(/\r?\n/).filter((line) => line.trim() !== "")
          lines.forEach((line) => {
            const listItem = document.createElement("li")
            listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
            listItem.textContent = line.trim()
            newList.appendChild(listItem)
          })
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          if (element.tagName === "P" || element.tagName === "DIV" || element.tagName === "BR") {
            // Handle paragraphs, divs, or explicit <br> as individual list items
            const listItem = document.createElement("li")
            listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
            if (element.tagName === "BR") {
              listItem.innerHTML = "<br>" // For a standalone BR, create an empty list item
            } else {
              // Move children of the paragraph/div to the list item
              while (element.firstChild) {
                listItem.appendChild(element.firstChild)
              }
            }
            newList.appendChild(listItem)
          } else if (element.tagName === "LI") {
            // If already an LI, just append it (or its content if re-wrapping)
            newList.appendChild(element)
          } else {
            // For other block-level elements, wrap them in an LI
            const listItem = document.createElement("li")
            listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
            listItem.appendChild(element.cloneNode(true)) // Clone to avoid moving existing elements
            newList.appendChild(listItem)
          }
        }
      })

      // If no list items were created from selected content, create one empty one
      if (newList.children.length === 0) {
        const listItem = document.createElement("li")
        listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
        listItem.innerHTML = "<br>"
        newList.appendChild(listItem)
      }

      range.insertNode(newList) // Insert the new list

      // Place cursor at the end of the last list item
      const lastListItem = newList.lastElementChild
      if (lastListItem) {
        const newRange = document.createRange()
        newRange.selectNodeContents(lastListItem)
        newRange.collapse(false) // Collapse to the end
        selection!.removeAllRanges()
        selection!.addRange(newRange)
      }
    } else {
      // Case 2: No text selected (collapsed range) - create a new list item
      const listItem = document.createElement("li")
      listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
      listItem.innerHTML = "<br>" // Empty content for new bullet

      let currentParent = range.commonAncestorContainer as HTMLElement
      let listContainer: HTMLUListElement | HTMLOListElement | null = null
      while (currentParent && currentParent !== editorRef.current) {
        if (currentParent.tagName === "UL" || currentParent.tagName === "OL") {
          listContainer = currentParent as HTMLUListElement | HTMLOListElement
          break
        }
        currentParent = currentParent.parentElement as HTMLElement
      }

      if (listContainer) {
        // If inside an existing list, append the new list item
        listContainer.appendChild(listItem)
      } else {
        // If not inside a list, create a new UL and append the list item
        const newList = document.createElement("ul")
        newList.style.cssText = "margin: 15px 0; padding-left: 30px; list-style-type: disc;"
        newList.appendChild(listItem)
        range.deleteContents()
        range.insertNode(newList)
      }

      // Place cursor inside the new list item
      const newRange = document.createRange()
      newRange.selectNodeContents(listItem)
      newRange.collapse(true) // Collapse to the start
      selection!.removeAllRanges()
      selection!.addRange(newRange)
    }

    editorRef.current.focus()
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML) // Update content state
    }
  }, [restoreSelection])

  const insertNumberedList = useCallback(() => {
    if (!editorRef.current) return

    restoreSelection() // Ensure selection is restored before acting

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // Fallback if restoreSelection didn't yield a range
      editorRef.current.focus()
      const newRange = document.createRange()
      newRange.selectNodeContents(editorRef.current)
      newRange.collapse(false) // Collapse to end
      selection?.removeAllRanges()
      selection?.addRange(newRange)
    }

    if (!selection!.isCollapsed) {
      // If text is selected, process it to create list items
      const range = selection!.getRangeAt(0)
      const selectedContent = range.extractContents() // Extract selected content

      const tempDiv = document.createElement("div")
      tempDiv.appendChild(selectedContent)

      const newList = document.createElement("ol")
      newList.style.cssText = "margin: 15px 0; padding-left: 30px; list-style-type: decimal;"

      // Process children of the extracted content
      Array.from(tempDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== "") {
          // Handle plain text nodes as individual list items
          const lines = node.textContent!.split(/\r?\n/).filter((line) => line.trim() !== "")
          lines.forEach((line) => {
            const listItem = document.createElement("li")
            listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
            listItem.textContent = line.trim()
            newList.appendChild(listItem)
          })
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          if (element.tagName === "P" || element.tagName === "DIV") {
            // Handle paragraphs or divs as individual list items
            const listItem = document.createElement("li")
            listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
            // Move children of the paragraph/div to the list item
            while (element.firstChild) {
              listItem.appendChild(element.firstChild)
            }
            newList.appendChild(listItem)
          } else if (element.tagName === "BR") {
            // Ignore standalone <br> tags
          } else {
            // For other block-level elements, wrap them in an LI
            const listItem = document.createElement("li")
            listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
            listItem.appendChild(element.cloneNode(true)) // Clone to avoid moving existing elements
            newList.appendChild(listItem)
          }
        }
      })

      // If no list items were created from selected content, create one empty one
      if (newList.children.length === 0) {
        const listItem = document.createElement("li")
        listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
        listItem.innerHTML = "<br>"
        newList.appendChild(listItem)
      }

      range.insertNode(newList) // Insert the new list

      // Place cursor at the end of the last list item
      const lastListItem = newList.lastElementChild
      if (lastListItem) {
        const newRange = document.createRange()
        newRange.selectNodeContents(lastListItem)
        newRange.collapse(false) // Collapse to the end
        selection!.removeAllRanges()
        selection!.addRange(newRange)
      }
    } else {
      // If no text is selected (collapsed range), use custom logic for empty bullet
      const range = selection!.getRangeAt(0)

      // Create the list item element
      const listItem = document.createElement("li")
      listItem.style.cssText = "margin-bottom: 8px; display: list-item;"
      listItem.innerHTML = "<br>" // Empty content for new bullet

      // Find the nearest UL or OL parent
      let currentParent = range.commonAncestorContainer as HTMLElement
      let listContainer: HTMLUListElement | HTMLOListElement | null = null
      while (currentParent && currentParent !== editorRef.current) {
        if (currentParent.tagName === "UL" || currentParent.tagName === "OL") {
          listContainer = currentParent as HTMLUListElement | HTMLOListElement
          break
        }
        currentParent = currentParent.parentElement as HTMLElement
      }

      if (listContainer) {
        // If inside an existing list, append the new list item
        listContainer.appendChild(listItem)
      } else {
        // If not inside a list, create a new OL and append the list item
        const newList = document.createElement("ol")
        newList.style.cssText = "margin: 15px 0; padding-left: 30px; list-style-type: decimal;"
        newList.appendChild(listItem)

        range.deleteContents() // Remove any selected content
        range.insertNode(newList) // Insert the new list
      }

      // Place cursor inside the new list item
      const newRange = document.createRange()
      newRange.selectNodeContents(listItem)
      newRange.collapse(true) // Collapse to the start
      selection!.removeAllRanges()
      selection!.addRange(newRange)
    }

    editorRef.current.focus()
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML) // Update content state
    }
  }, [restoreSelection])

  const formatText = useCallback(
    (format: string) => {
      executeCommand(format)
    },
    [executeCommand],
  )

  const alignText = useCallback(
    (alignment: string) => {
      executeCommand(`justify${alignment}`)
    },
    [executeCommand],
  )

  const insertLink = useCallback(() => {
    const url = prompt("Enter the URL:")
    if (url) {
      executeCommand("createLink", url)
    }
  }, [executeCommand])

  const insertImageIntoEditor = useCallback((imageUrl: string) => {
    if (!editorRef.current) return

    editorRef.current.focus()
    let selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      const newRange = document.createRange()
      newRange.selectNodeContents(editorRef.current)
      newRange.collapse(false)
      selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(newRange)
    }
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      const img = document.createElement("img")
      img.src = imageUrl
      img.alt = "Uploaded Image"
      img.style.maxWidth = "100%"
      img.style.height = "auto"
      img.style.display = "block"
      img.style.margin = "8px 0"

      range.deleteContents()
      range.insertNode(img)

      // Move cursor after the image
      range.setStartAfter(img)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)

      setSelectedImage(img)
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (onImageUpload) {
        onImageUpload(file).then((imageUrl) => {
          insertImageIntoEditor(imageUrl)
        }).catch(() => {
          // fallback to base64 if upload fails
          const reader = new FileReader()
          reader.onloadend = () => insertImageIntoEditor(reader.result as string)
          reader.readAsDataURL(file)
        })
      } else {
        const reader = new FileReader()
        reader.onloadend = () => insertImageIntoEditor(reader.result as string)
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload, insertImageIntoEditor],
  )

  const addTableRowBelow = useCallback((targetCell?: HTMLTableCellElement) => {
    const selection = window.getSelection()
    let currentCell: HTMLElement | null = null

    if (targetCell) {
      currentCell = targetCell
    } else if (selection && selection.rangeCount > 0) {
      currentCell = selection.getRangeAt(0).commonAncestorContainer as HTMLElement
      // Traverse up to find the nearest TD
      while (currentCell && currentCell !== editorRef.current && currentCell.tagName !== "TD") {
        currentCell = currentCell.parentElement as HTMLElement
      }
    }

    if (currentCell && currentCell.tagName === "TD") {
      const currentRow = currentCell.closest("tr")
      if (currentRow) {
        const newRow = document.createElement("tr")
        const numCols = currentRow.children.length
        for (let i = 0; i < numCols; i++) {
          const newCell = document.createElement("td")
          newCell.setAttribute("contenteditable", "true")
          newCell.style.cssText = `
          border: 1px solid #666; 
          padding: 12px; 
          /* Removed min-width to allow cells to shrink */
          min-height: 40px;
          background-color: #f9f9f9;
          vertical-align: top;
        `
          newCell.innerHTML = "<br>" // Ensure cell is not empty for cursor placement
          newRow.appendChild(newCell)
        }
        currentRow.after(newRow)
        // Move cursor to the first cell of the new row
        const firstNewCell = newRow.querySelector("td")
        if (firstNewCell && selection) {
          const newRange = document.createRange()
          newRange.selectNodeContents(firstNewCell)
          newRange.collapse(true) // Collapse to the start
          selection.removeAllRanges()
          selection.addRange(newRange)
          editorRef.current?.focus()
        }
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML) // Update content state
    }
  }, [])

  const addTableRowAbove = useCallback((targetCell: HTMLTableCellElement) => {
    const selection = window.getSelection()
    const currentRow = targetCell.closest("tr")

    if (currentRow) {
      const newRow = document.createElement("tr")
      const numCols = currentRow.children.length
      for (let i = 0; i < numCols; i++) {
        const newCell = document.createElement("td")
        newCell.setAttribute("contenteditable", "true")
        newCell.style.cssText = `
        border: 1px solid #666; 
        padding: 12px; 
        min-height: 40px;
        background-color: #f9f9f9;
        vertical-align: top;
      `
        newCell.innerHTML = "<br>"
        newRow.appendChild(newCell)
      }
      currentRow.before(newRow) // Insert before the current row

      // Move cursor to the first cell of the new row
      const firstNewCell = newRow.querySelector("td")
      if (firstNewCell && selection) {
        const newRange = document.createRange()
        newRange.selectNodeContents(firstNewCell)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
        editorRef.current?.focus()
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  const addTableColumnRight = useCallback((targetCell?: HTMLTableCellElement) => {
    const selection = window.getSelection()
    let currentCell: HTMLElement | null = null

    if (targetCell) {
      currentCell = targetCell
    } else if (selection && selection.rangeCount > 0) {
      currentCell = selection.getRangeAt(0).commonAncestorContainer as HTMLElement
      // Traverse up to find the nearest TD
      while (currentCell && currentCell !== editorRef.current && currentCell.tagName !== "TD") {
        currentCell = currentCell.parentElement as HTMLElement
      }
    }

    if (currentCell && currentCell.tagName === "TD") {
      const currentRow = currentCell.closest("tr")
      const parentTable = currentCell.closest("table")
      if (currentRow && parentTable) {
        // Get the index of the current cell within its row
        const cellsInRow = Array.from(currentRow.children)
        const currentCellIndex = cellsInRow.indexOf(currentCell)

        const rows = Array.from(parentTable.querySelectorAll("tr"))
        let newCellInCurrentRow: HTMLTableCellElement | null = null
        rows.forEach((row) => {
          const newCell = document.createElement("td")
          newCell.setAttribute("contenteditable", "true")
          newCell.style.cssText = `
          border: 1px solid #666; 
          padding: 12px; 
          /* Removed min-width to allow cells to shrink */
          min-height: 40px;
          background-color: #f9f9f9;
          vertical-align: top;
        `
          newCell.innerHTML = "<br>" // Ensure cell is not empty for cursor placement

          // Insert the new cell after the current cell in each row
          if (currentCellIndex !== -1 && row.children[currentCellIndex]) {
            row.children[currentCellIndex].after(newCell)
          } else {
            row.appendChild(newCell) // Fallback to append if index is not found (e.g., empty row)
          }

          if (row === currentRow) {
            newCellInCurrentRow = newCell
          }
        })
        // Move cursor to the newly created cell in the current row
        if (newCellInCurrentRow && selection) {
          const newRange = document.createRange()
          newRange.selectNodeContents(newCellInCurrentRow)
          newRange.collapse(true) // Collapse to the start
          selection.removeAllRanges()
          selection.addRange(newRange)
          editorRef.current?.focus()
        }
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML) // Update content state
    }
  }, [])

  const addTableColumnLeft = useCallback((targetCell: HTMLTableCellElement) => {
    const selection = window.getSelection()
    const currentRow = targetCell.closest("tr")
    const parentTable = targetCell.closest("table")

    if (currentRow && parentTable) {
      const cellsInRow = Array.from(currentRow.children)
      const columnIndex = cellsInRow.indexOf(targetCell)

      if (columnIndex !== -1) {
        const allRows = Array.from(parentTable.querySelectorAll("tr"))
        let newCellInCurrentRow: HTMLTableCellElement | null = null
        allRows.forEach((row) => {
          const newCell = document.createElement("td")
          newCell.setAttribute("contenteditable", "true")
          newCell.style.cssText = `
          border: 1px solid #666; 
          padding: 12px; 
          min-height: 40px;
          background-color: #f9f9f9;
          vertical-align: top;
        `
          newCell.innerHTML = "<br>"

          // Insert the new cell before the current cell in each row
          if (row.children[columnIndex]) {
            row.children[columnIndex].before(newCell)
          } else {
            row.prepend(newCell) // Fallback to prepend if index is not found (e.g., empty row)
          }

          if (row === currentRow) {
            newCellInCurrentRow = newCell
          }
        })
        // Move cursor to the newly created cell in the current row
        if (newCellInCurrentRow && selection) {
          const newRange = document.createRange()
          newRange.selectNodeContents(newCellInCurrentRow)
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)
          editorRef.current?.focus()
        }
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  const deleteTableRow = useCallback((targetCell: HTMLTableCellElement) => {
    const selection = window.getSelection()
    const currentRow = targetCell.closest("tr")
    const parentTable = targetCell.closest("table")

    if (currentRow && parentTable) {
      const tbody = parentTable.querySelector("tbody")
      if (tbody) {
        const rows = Array.from(tbody.children)
        if (rows.length > 1) {
          // If more than one row, just delete the current row
          currentRow.remove()
          // Move cursor to the previous row if available, otherwise next row
          const newRowToFocus = currentRow.previousElementSibling || tbody.firstElementChild
          if (newRowToFocus) {
            const firstCellInNewRow = newRowToFocus.querySelector("td")
            if (firstCellInNewRow && selection) {
              const newRange = document.createRange()
              newRange.selectNodeContents(firstCellInNewRow)
              newRange.collapse(true)
              selection.removeAllRanges()
              selection.addRange(newRange)
              editorRef.current?.focus()
            }
          }
        } else {
          // If only one row, delete the entire table
          parentTable.remove()
          // Insert a new paragraph where the table was
          const newParagraph = document.createElement("p")
          newParagraph.innerHTML = "<br>"
          editorRef.current?.appendChild(newParagraph)
          if (selection) {
            const newRange = document.createRange()
            newRange.selectNodeContents(newParagraph)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
            editorRef.current?.focus()
          }
        }
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  const deleteTableColumn = useCallback((targetCell: HTMLTableCellElement) => {
    const selection = window.getSelection()
    const currentRow = targetCell.closest("tr")
    const parentTable = targetCell.closest("table")

    if (currentRow && parentTable) {
      const cellsInRow = Array.from(currentRow.children)
      const columnIndex = cellsInRow.indexOf(targetCell)

      if (columnIndex !== -1) {
        const allRows = Array.from(parentTable.querySelectorAll("tr"))
        let columnDeleted = false
        allRows.forEach((row) => {
          if (row.children[columnIndex]) {
            row.children[columnIndex].remove()
            columnDeleted = true
          }
        })

        if (columnDeleted) {
          // Check if any columns are left in the first row (assuming consistent columns)
          if (allRows[0] && allRows[0].children.length === 0) {
            // If no columns left, delete the entire table
            parentTable.remove()
            const newParagraph = document.createElement("p")
            newParagraph.innerHTML = "<br>"
            editorRef.current?.appendChild(newParagraph)
            if (selection) {
              const newRange = document.createRange()
              newRange.selectNodeContents(newParagraph)
              newRange.collapse(true)
              selection.removeAllRanges()
              selection.addRange(newRange)
              editorRef.current?.focus()
            }
          } else {
            // Move cursor to the previous column if available, otherwise first column in the row
            const newCellToFocus = cellsInRow[columnIndex - 1] || cellsInRow[0]
            if (newCellToFocus && selection) {
              const newRange = document.createRange()
              newRange.selectNodeContents(newCellToFocus)
              newRange.collapse(true)
              selection.removeAllRanges()
              selection.addRange(newRange)
              editorRef.current?.focus()
            }
          }
        }
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  const deleteTable = useCallback((targetCell: HTMLTableCellElement) => {
    const selection = window.getSelection()
    const parentTable = targetCell.closest("table")

    if (parentTable) {
      parentTable.remove()
      // Insert a new paragraph where the table was
      const newParagraph = document.createElement("p")
      newParagraph.innerHTML = "<br>"
      editorRef.current?.appendChild(newParagraph)
      if (selection) {
        const newRange = document.createRange()
        newRange.selectNodeContents(newParagraph)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
        editorRef.current?.focus()
      }
    }
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      
      if ((e.key === "Delete" || e.key === "Backspace") && selectedImage && editorRef.current) {
        e.preventDefault()
        const imgToRemove = selectedImage
        const parentNode = imgToRemove.parentNode
        // Insert a placeholder to position the caret after deletion
        const placeholder = document.createElement("span")
        placeholder.innerHTML = "<br>"
        if (parentNode) {
          // Try to place caret after the image
          parentNode.insertBefore(placeholder, imgToRemove.nextSibling)
          imgToRemove.remove()
          const selection = window.getSelection()
          if (selection) {
            const newRange = document.createRange()
            newRange.selectNodeContents(placeholder)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
        } else {
          // Fallback just in case
          imgToRemove.remove()
        }
        setSelectedImage(null)
        setEditorContent(editorRef.current.innerHTML)
        return
      }

      // Shift + Enter for new table row OR to leave bullet points
      if (e.shiftKey && e.key === "Enter") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const currentNode = selection.getRangeAt(0).commonAncestorContainer as HTMLElement
          // Check if inside a table cell
          let isInsideTableCell = false
          let tempNode = currentNode
          while (tempNode && tempNode !== editorRef.current) {
            if (tempNode.tagName === "TD") {
              isInsideTableCell = true
              break
            }
            tempNode = tempNode.parentElement as HTMLElement
          }

          if (isInsideTableCell) {
            e.preventDefault() // Prevent default new line
            addTableRowBelow()
            return
          } else {
            // If not inside a table cell, check if inside a list item
            let listItem: HTMLLIElement | null = null
            tempNode = currentNode
            while (tempNode && tempNode !== editorRef.current) {
              if (tempNode.tagName === "LI") {
                listItem = tempNode as HTMLLIElement
                break
              }
              tempNode = tempNode.parentElement as HTMLElement
            }

            if (listItem) {
              e.preventDefault()
              const parentList = listItem.closest("ul, ol")
              if (parentList) {
                const newParagraph = document.createElement("p")
                newParagraph.innerHTML = "<br>"
                parentList.after(newParagraph)

                const newRange = document.createRange()
                newRange.selectNodeContents(newParagraph)
                newRange.collapse(true)
                selection.removeAllRanges()
                selection.addRange(newRange)

                if (editorRef.current) {
                  editorRef.current.focus()
                  setEditorContent(editorRef.current.innerHTML)
                }
                return
              }
            }
          }
        }
      }
      // Enter in last cell of table for new column
      if (e.key === "Enter" && !e.shiftKey) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          let currentCell = selection.getRangeAt(0).commonAncestorContainer as HTMLElement
          while (currentCell && currentCell !== editorRef.current && currentCell.tagName !== "TD") {
            currentCell = currentCell.parentElement as HTMLElement
          }
          if (currentCell && currentCell.tagName === "TD") {
            const currentRow = currentCell.closest("tr")
            if (currentRow) {
              const cellsInRow = Array.from(currentRow.children)
              const isLastCellInRow = cellsInRow.indexOf(currentCell) === cellsInRow.length - 1
              if (isLastCellInRow) {
                e.preventDefault()
                addTableColumnRight()
                return
              }
            }
          }
        }
      }

      // Logic for Enter key within list items
      if (e.key === "Enter") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          let currentNode = range.commonAncestorContainer as HTMLElement

          // Traverse up to find the nearest LI
          let listItem: HTMLLIElement | null = null
          while (currentNode && currentNode !== editorRef.current) {
            if (currentNode.tagName === "LI") {
              listItem = currentNode as HTMLLIElement
              break
            }
            currentNode = currentNode.parentElement as HTMLElement
          }

          if (listItem) {
            e.preventDefault()

            const isEmptyListItem =
              listItem.innerHTML === "<br>" || listItem.innerHTML === "" || listItem.textContent?.trim() === ""

            if (isEmptyListItem) {
              const parentList = listItem.closest("ul, ol")
              if (parentList) {
                const newParagraph = document.createElement("p")
                newParagraph.innerHTML = "<br>"
                parentList.after(newParagraph)

                const newRange = document.createRange()
                newRange.selectNodeContents(newParagraph)
                newRange.collapse(true)
                selection.removeAllRanges()
                selection.addRange(newRange)
              } else {
                document.execCommand("insertParagraph")
              }
            } else {
              const newListItem = document.createElement("li")
              newListItem.style.cssText = "margin-bottom: 8px; display: list-item;"
              newListItem.innerHTML = "<br>"

              listItem.after(newListItem)

              const newRange = document.createRange()
              newRange.selectNodeContents(newListItem)
              newRange.collapse(true)
              selection.removeAllRanges()
              selection.addRange(newRange)
            }

            if (editorRef.current) {
              editorRef.current.focus()
              setEditorContent(editorRef.current.innerHTML)
            }
            return
          }
        }
      }

      // Ctrl+B for bold
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault()
        formatText("bold")
      }
      // Ctrl+I for italic
      if (e.ctrlKey && e.key.toLowerCase() === "i") {
        e.preventDefault()
        formatText("italic")
      }
      // Ctrl+U for underline
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault()
        formatText("underline")
      }
      // Ctrl+Q for quick table
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault()
        insertQuickTable()
      }
    },
    [formatText, insertQuickTable, addTableRowBelow, addTableColumnRight],
  )

  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target instanceof HTMLImageElement) {
        setSelectedImage(e.target)
      } else {
        setSelectedImage(null)
      }
      saveSelection() // Save selection on any click within the editor
      setShowTableContextMenu(false) // Hide context menu on any click
    },
    [saveSelection],
  )

  const handleEditorMouseUp = useCallback(() => {
    saveSelection() // Save selection on mouse up (after selection is made)
  }, [saveSelection])

  const handleImageTransformEnd = useCallback(() => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML)
    }
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    let target = e.target as HTMLElement
    let isInsideTable = false
    let clickedCell: HTMLTableCellElement | null = null

    // Traverse up the DOM to find if the click was inside a <td>
    while (target && target !== editorRef.current) {
      if (target.tagName === "TD") {
        isInsideTable = true
        clickedCell = target as HTMLTableCellElement
        break
      }
      target = target.parentElement as HTMLElement
    }

    if (isInsideTable && clickedCell) {
      e.preventDefault() // Prevent default browser context menu
      setShowTableContextMenu(true)

      // Calculate position relative to the editorWrapperRef
      if (editorWrapperRef.current) {
        const editorWrapperRect = editorWrapperRef.current.getBoundingClientRect()
        setContextMenuPosition({
          x: e.clientX - editorWrapperRect.left,
          y: e.clientY - editorWrapperRect.top,
        })
      } else {
        // Fallback if editorWrapperRef is not available
        setContextMenuPosition({ x: e.clientX, y: e.clientY })
      }

      contextMenuTargetCell.current = clickedCell // Store the clicked cell
    } else {
      setShowTableContextMenu(false) // Hide if not clicking on a table cell
    }
  }, [])

  const TableSelector: React.FC<{ onSelect: (dimensions: TableDimensions) => void }> = ({ onSelect }) => {
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
    const handleCellHover = (row: number, col: number) => {
      setHoveredCell({ row, col })
    }
    const handleCellClick = (row: number, col: number) => {
      onSelect({ rows: row + 1, cols: col + 1 })
      setShowTableSelector(false) // Close selector on selection
    }
    return (
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 64 }, (_, index) => {
          const row = Math.floor(index / 8)
          const col = index % 8
          const isHighlighted = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col
          return (
            <div
              key={index}
              className={`w-4 h-4 border border-gray-300 cursor-pointer ${isHighlighted ? "bg-blue-500" : "bg-white hover:bg-gray-100"}`}
              onMouseEnter={() => handleCellHover(row, col)}
              onClick={() => handleCellClick(row, col)}
            />
          )
        })}
        {hoveredCell && (
          <div className="col-span-8 text-xs text-gray-500 mt-2">
            {hoveredCell.row + 1} × {hoveredCell.col + 1} table
          </div>
        )}
      </div>
    )
  }

  const toolbarBtnClass = "h-8 w-8 p-0 cursor-pointer rounded-md transition-colors"

  const ToolGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-md" style={{ backgroundColor: `${colors.hoverBg}80` }}>
      {children}
    </div>
  )

  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
      <div className="border-b px-3 py-2" style={{ borderColor: colors.cardBorder, backgroundColor: colors.background }}>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToolGroup>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("bold")} className={toolbarBtnClass} title="Bold (Ctrl+B)"><Bold className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("italic")} className={toolbarBtnClass} title="Italic (Ctrl+I)"><Italic className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("underline")} className={toolbarBtnClass} title="Underline (Ctrl+U)"><Underline className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("strikeThrough")} className={toolbarBtnClass} title="Strikethrough"><Strikethrough className="h-4 w-4" /></Button>
          </ToolGroup>

          <Separator orientation="vertical" className="h-6 mx-0.5" />

          <select
            className="h-8 px-2 text-xs border rounded cursor-pointer bg-transparent"
            style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
            onChange={(e) => { restoreSelection(); executeCommand("fontName", e.target.value) }}
            defaultValue="Arial"
            title="Font Family"
          >
            {["Arial","Verdana","Times New Roman","Georgia","Courier New","Roboto","Open Sans","Lato","Montserrat"].map(f => (
              <option key={f} value={f} style={{ backgroundColor: colors.cardBg }}>{f}</option>
            ))}
          </select>

          <Separator orientation="vertical" className="h-6 mx-0.5" />

          <ToolGroup>
            <Button type="button" variant="ghost" size="sm" title="Align Left" onClick={() => alignText("Left")} className={toolbarBtnClass}><AlignLeft className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" title="Align Center" onClick={() => alignText("Center")} className={toolbarBtnClass}><AlignCenter className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" title="Align Right" onClick={() => alignText("Right")} className={toolbarBtnClass}><AlignRight className="h-4 w-4" /></Button>
          </ToolGroup>

          <Separator orientation="vertical" className="h-6 mx-0.5" />

          <ToolGroup>
            <Button type="button" variant="ghost" size="sm" onClick={insertBulletList} className={toolbarBtnClass} title="Bullet List"><List className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertNumberedList} className={toolbarBtnClass} title="Numbered List"><ListOrdered className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => executeCommand("indent")} className={toolbarBtnClass} title="Indent"><Indent className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => executeCommand("outdent")} className={toolbarBtnClass} title="Outdent"><Outdent className="h-4 w-4" /></Button>
          </ToolGroup>

          <Separator orientation="vertical" className="h-6 mx-0.5" />

          <ToolGroup>
            <Button type="button" variant="ghost" size="sm" onClick={insertLink} className={toolbarBtnClass} title="Insert Link"><Link className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => executeCommand("insertHorizontalRule")} className={toolbarBtnClass} title="Horizontal Rule"><Minus className="h-4 w-4" /></Button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className={toolbarBtnClass} title="Insert Image"><ImageIcon className="h-4 w-4" /></Button>
          </ToolGroup>

          <Separator orientation="vertical" className="h-6 mx-0.5" />

          <ToolGroup>
            <Button type="button" variant="ghost" size="sm" onClick={() => executeCommand("undo")} className={toolbarBtnClass} title="Undo"><Undo className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => executeCommand("redo")} className={toolbarBtnClass} title="Redo"><Redo className="h-4 w-4" /></Button>
          </ToolGroup>

          <Separator orientation="vertical" className="h-6 mx-0.5" />

          <select
            className="h-8 px-2 text-xs border rounded cursor-pointer bg-transparent"
            style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
            onChange={(e) => executeCommand("fontSize", e.target.value)}
            defaultValue="3"
            title="Font Size"
          >
            {[{v:"1",l:"8pt"},{v:"2",l:"10pt"},{v:"3",l:"12pt"},{v:"4",l:"14pt"},{v:"5",l:"18pt"},{v:"6",l:"24pt"},{v:"7",l:"36pt"}].map(s => (
              <option key={s.v} value={s.v} style={{ backgroundColor: colors.cardBg }}>{s.l}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <div className="relative h-8 w-8 rounded-md overflow-hidden border" style={{ borderColor: colors.cardBorder }}>
              <input type="color" className="absolute inset-0 w-full h-full cursor-pointer opacity-0" onChange={(e) => executeCommand("foreColor", e.target.value)} title="Text Color" />
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold" style={{ color: colors.textPrimary }}>A</div>
            </div>
            <div className="relative h-8 w-8 rounded-md overflow-hidden border" style={{ borderColor: colors.cardBorder, backgroundColor: colors.hoverBg }}>
              <input type="color" className="absolute inset-0 w-full h-full cursor-pointer opacity-0" onChange={handleBackColorChange} title="Background Color" />
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold" style={{ color: colors.textSecondary }}>BG</div>
            </div>
          </div>

          <div className="relative">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowTableSelector((prev) => !prev)} className={toolbarBtnClass} title="Insert Table"><Table className="h-4 w-4" /></Button>
            {showTableSelector && (
              <div className="absolute top-full left-0 mt-2 border rounded-lg shadow-xl p-3 z-10 min-w-max" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <div className="text-xs mb-2" style={{ color: colors.textSecondary }}>Select table size:</div>
                <TableSelector onSelect={insertTable} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative" ref={editorWrapperRef}>
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[280px] max-h-[500px] overflow-y-auto p-5 focus:outline-none"
          style={{ lineHeight: "1.7", fontSize: "14px", color: colors.textPrimary }}
          onKeyDown={handleKeyDown}
          onInput={() => { if (editorRef.current) setEditorContent(editorRef.current.innerHTML) }}
          onClick={handleEditorClick}
          onMouseUp={handleEditorMouseUp}
          onContextMenu={handleContextMenu}
          suppressContentEditableWarning={true}
        ></div>

        {selectedImage && editorWrapperRef.current && (
          <ImageResizeHandles
            imgElement={selectedImage}
            parentContainerRef={editorWrapperRef as React.RefObject<HTMLElement>}
            onResize={handleImageTransformEnd}
            onDeselect={() => setSelectedImage(null)}
          />
        )}

        {showTableContextMenu && (
          <TableContextMenu
            x={contextMenuPosition.x}
            y={contextMenuPosition.y}
            onAddRowBelow={() => addTableRowBelow(contextMenuTargetCell.current!)}
            onAddRowAbove={() => addTableRowAbove(contextMenuTargetCell.current!)}
            onAddColumnRight={() => addTableColumnRight(contextMenuTargetCell.current!)}
            onAddColumnLeft={() => addTableColumnLeft(contextMenuTargetCell.current!)}
            onDeleteRow={() => deleteTableRow(contextMenuTargetCell.current!)}
            onDeleteColumn={() => deleteTableColumn(contextMenuTargetCell.current!)}
            onDeleteTable={() => deleteTable(contextMenuTargetCell.current!)}
            onClose={() => setShowTableContextMenu(false)}
          />
        )}
      </div>
    </div>
  )
}

export default RichTextEditor