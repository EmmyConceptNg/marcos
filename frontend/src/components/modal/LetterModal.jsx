import { Box, Modal, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Text from "../Text";
import Button from "../Button";
import BuyCreditModal from "./BuyCreditModal";
import PropTypes from "prop-types";
import { PDFDocument, rgb } from "pdf-lib";
import axios from "../../api/axios";
import { notify } from "../../utils/Index";
import { setUser } from "../../redux/UserReducer";
import { useDispatch } from "react-redux";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  DecoupledEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  Paragraph,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { htmlToText } from "html-to-text";



const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  p: 4,
};

// Utility functions for base64 encoding/decoding
const base64ToUint8Array = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const uint8ArrayToBase64 = (uint8Array) => {
  let binaryString = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  return window.btoa(binaryString);
};

export default function LetterModal({
  open,
  setOpen,
  letterContent,
  letterPath,
  setLetterPath,
  setLetterContent,
  letterBureau,
  handleSaveLetter,
  selectedLetter,
  user,
}) {



  // CK EDITOR CONFIG

  	const editorContainerRef = useRef(null);
	const editorMenuBarRef = useRef(null);
	const editorToolbarRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const editorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'|',
				'link',
				'insertImageViaUrl',
				'insertTable',
				'highlight',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'indent',
				'outdent'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			AccessibilityHelp,
			Alignment,
			Autoformat,
			AutoImage,
			AutoLink,
			Autosave,
			BalloonToolbar,
			BlockQuote,
			Bold,
			Code,
			Essentials,
			FindAndReplace,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			Heading,
			Highlight,
			HorizontalLine,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			Indent,
			IndentBlock,
			Italic,
			Link,
			LinkImage,
			Paragraph,
			RemoveFormat,
			SelectAll,
			SpecialCharacters,
			SpecialCharactersArrows,
			SpecialCharactersCurrency,
			SpecialCharactersEssentials,
			SpecialCharactersLatin,
			SpecialCharactersMathematical,
			SpecialCharactersText,
			Strikethrough,
			Subscript,
			Superscript,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TextTransformation,
			Underline,
			Undo
		],
		balloonToolbar: ['bold', 'italic', '|', 'link'],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		menuBar: {
			isVisible: true
		},
		placeholder: 'Type or paste your content here!',
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		}
	};
  
  // END CONFIG







  const handleClose = () => setOpen(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(letterContent);
  const [buyCredit, setBuyCredit] = useState(false);
  const [changingLanguage, setChangingLanguage] = useState(false);

  const dispatch = useDispatch();

  const convertToPlainText = (html) => {
    return htmlToText(html, { wordwrap: 130 });
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditContent(letterContent); // Initialize with current letter content
  };

  const saveEditing = async () => {
    try {
      console.log("Original letterPath:", letterPath);
      console.log("Decoded letterPath:", atob(letterPath));

      const pdfBytes = base64ToUint8Array(letterPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const firstPage = pdfDoc.getPages()[0];
      const { width, height } = firstPage.getSize();

      // Clear existing content before adding new text
      firstPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(1, 1, 1),
      });

      const plainTextContent = convertToPlainText(editContent);

      firstPage.drawText(plainTextContent, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      });

      const newPdfBytes = await pdfDoc.save();
      const modifiedBase64 = uint8ArrayToBase64(new Uint8Array(newPdfBytes));

      setLetterContent(editContent); // Update the text content
      await handleSaveLetter(editContent, modifiedBase64); // Save both content and updated PDF
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving editing:", error);
    }
  };

  const changeLanguage = (language) => {
    setChangingLanguage(true);
    axios
      .post("/api/utils/language", { language, letterContent })
      .then((response) => {
        setEditContent(response.data.letterContent);
        setChangingLanguage(false);
      })
      .finally(() => {
        notify(`language changed to ${language} `, "success");
        setChangingLanguage(false);
      });
  };

  const handleNotarize = () => {
    setChangingLanguage(true);
    axios
      .post(`/api/letters/${selectedLetter}/notarize`, { userId: user?._id })
      .then((response) => {
        setLetterPath(response.data.letterPath);
        dispatch(setUser(response.data.user));
        notify(`Letter Notarized`, "success");
      })
      .finally(() => {
        handleClose();
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={3} sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Text variant="h6">Letter Content for {letterBureau}</Text>
            {!isEditing ? (
              <iframe
                src={`data:application/pdf;base64,${letterPath}`}
                title="PDF Letter"
                width="100%"
                height="500px"
                style={{ flex: 1 }}
              />
            ) : (
              <Box flexGrow={1} overflow="auto">
                <div className="main-container">
                  <div
                    className="editor-container editor-container_document-editor"
                    ref={editorContainerRef}
                  >
                    <div
                      className="editor-container__menu-bar"
                      ref={editorMenuBarRef}
                    ></div>
                    <div
                      className="editor-container__toolbar"
                      ref={editorToolbarRef}
                    ></div>
                    <div className="editor-container__editor-wrapper">
                      <div className="editor-container__editor">
                        <div ref={editorRef}>
                          {isLayoutReady && (
                            <CKEditor
                              onReady={(editor) => {
                                editorToolbarRef.current.appendChild(
                                  editor.ui.view.toolbar.element
                                );
                                editorMenuBarRef.current.appendChild(
                                  editor.ui.view.menuBarView.element
                                );
                              }}
                              onAfterDestroy={() => {
                                Array.from(
                                  editorToolbarRef.current.children
                                ).forEach((child) => child.remove());
                                Array.from(
                                  editorMenuBarRef.current.children
                                ).forEach((child) => child.remove());
                              }}
                              editor={DecoupledEditor}
                              config={editorConfig}
                              data={editContent}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditContent(data);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </Box>
            )}
          </Stack>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={handleClose} color="#131C30">
              Cancel
            </Button>
            <Stack spacing={2} direction="row">
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    loading={changingLanguage}
                    width="165px"
                    sx={{ mx: 3 }}
                    color="#131C30"
                    dropdown
                    dropdownItems={[
                      {
                        text: "English",
                        onClick: () => changeLanguage("english"),
                      },
                      {
                        text: "Spanish",
                        onClick: () => changeLanguage("spanish"),
                      },
                    ]}
                  >
                    Change Language
                  </Button>
                  <Button variant="contained" onClick={saveEditing}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" onClick={handleNotarize}>
                    Notarize
                  </Button>
                  <Button variant="contained" onClick={startEditing}>
                    Edit
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Modal>
      <BuyCreditModal open={buyCredit} setOpen={setBuyCredit} />
    </>
  );
}

LetterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  handleSaveLetter: PropTypes.func,
  setLetterContent: PropTypes.func,
  letterContent: PropTypes.string,
  letterBureau: PropTypes.string,
  selectedLetter: PropTypes.string,
  letterPath: PropTypes.string, // Ensure this is passed as a base64 encoded string
};
