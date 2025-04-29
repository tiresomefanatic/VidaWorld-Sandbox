import React, { useState, useEffect, useRef } from "react";
import CONSTANT from "../../../../site/scripts/constant";
import { useSignedURL } from "../../../hooks/testDrive/uploadDocument/uploadDocumentsHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import FileBase64 from "react-file-base64";
import PropTypes from "prop-types";

const UploadCards = (props) => {
  const {
    title,
    text,
    description,
    disclaimer,
    id,
    uploadButtonText,
    fieldName
  } = props.documentData;

  const { error, success, fileFormatText } = props.messagesData;
  const { setUploadData, uploadCardError } = props;

  const [listingData, setListingData] = useState();
  const notInitialRender = useRef(false);
  const [fileName, setFileName] = useState();
  const [status, setStatus] = useState({
    isError: false,
    isSuccess: false
  });
  const keyMap = {
    DLFRONT: "front_key",
    DLBACK: "back_key"
  };

  const checker = CONSTANT.FILE_REGEX_IMAGE;
  const setDlSignedUrl = useSignedURL();

  const setupUploadFile = (file) => {
    if (checker.test(file.type) && file.size.match(/\d+/g)[0] < 1024) {
      setListingData({
        docType: id,
        extension: file.name.split(".")[file.name.split(".").length - 1],
        base64_encoded_file: file.base64.split("base64,")[1]
      });
      setFileName(file.name);
    } else {
      setStatus({
        isError: true,
        isSuccess: false
      });
      setFileName("");
      setUploadData(keyMap[id], true);
    }
  };

  useEffect(() => {
    if (notInitialRender.current) {
      setSpinnerActionDispatcher(true);
      const data = {};
      setDlSignedUrl({
        variables: listingData
      }).then((res) => {
        if (res.data) {
          setStatus({
            isError: false,
            isSuccess:
              res.data &&
              res.data.getDlSignedUrl &&
              res.data.getDlSignedUrl.status_code
          });
          data[keyMap[listingData.docType]] = res.data.getDlSignedUrl.docKey;
          setUploadData(data);
          setSpinnerActionDispatcher(false);
        }
        if (res.errors) {
          setStatus({
            isError: true,
            isSuccess: false
          });
          setFileName("");
          setUploadData(keyMap[listingData.docType], true);
          setSpinnerActionDispatcher(false);
        }
      });
    } else {
      notInitialRender.current = true;
    }
  }, [listingData]);

  return (
    <div className="vida-upload-card__container">
      <div className="vida-upload-card__title">{title}</div>
      <div
        id={fieldName}
        className={`vida-upload-card__body ${
          status.isError || uploadCardError
            ? "error"
            : status.isSuccess
            ? "success"
            : ""
        }`}
      >
        <h3 className="vida-upload-card__head">
          <i className="icon-camera"></i>
          {text}
        </h3>
        <ul>
          <li>
            <p className="p2">{description}</p>
            <p className="p2 vida-upload-card__body-disclaimer">{disclaimer}</p>
          </li>
          {fileFormatText ? (
            <li>
              <p className="p2 vida-upload-card__valid-message">
                {fileFormatText}
              </p>
            </li>
          ) : (
            ""
          )}
        </ul>
        {fileName ? (
          <p className="file-name">
            <i className="icon-document-text"></i>
            {fileName}
          </p>
        ) : (
          ""
        )}
        <div className="vida-upload-card__upload">
          <div className="vida-upload-card__file-upload">
            <span className="vida-upload-card__file-upload-btn">
              <i className="icon-upload"></i> {uploadButtonText || text}
            </span>
            <FileBase64
              hidden
              id="vida-upload-card__upload-btn"
              type="file"
              multiple={false}
              onDone={(file) => setupUploadFile(file)}
            />
          </div>
        </div>
      </div>
      {status.isError || uploadCardError ? (
        <p className="error">{error}</p>
      ) : (
        ""
      )}
      {status.isSuccess ? <p className="success">{success}</p> : ""}
    </div>
  );
};

UploadCards.propTypes = {
  documentData: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    description: PropTypes.string,
    disclaimer: PropTypes.string,
    uploadButtonText: PropTypes.string,
    id: PropTypes.string,
    fieldName: PropTypes.string
  }),
  messagesData: PropTypes.shape({
    error: PropTypes.string,
    success: PropTypes.string,
    fileFormatText: PropTypes.string
  }),
  uploadCardError: PropTypes.bool,
  setUploadData: PropTypes.func
};

export default UploadCards;
UploadCards;

UploadCards;
