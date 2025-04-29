import React, { useState, useEffect, useRef } from "react";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import CONSTANT from "../../../../site/scripts/constant";
import { useUploadDocuments } from "../../../hooks/uploadDocument/uploadDocumentsHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import FileBase64 from "react-file-base64";
import PropTypes from "prop-types";

const UploadCards = (props) => {
  const { title, text, description, disclaimer, id, uploadButtonText } =
    props.documentData;
  const { error, success, fileFormatText } = props.messagesData;
  const { setUploadData } = props;

  const [fileName, setFileName] = useState();
  const [status, setStatus] = useState({
    isError: false,
    isSuccess: false
  });
  const [listingData, setListingData] = useState({
    "order-id": ""
  });
  const notInitialRender = useRef(false);
  const queryString = location.href.split("?")[1];

  let decryptedParams = "";
  if (queryString) {
    decryptedParams = cryptoUtils.decrypt(queryString);
  }
  const params = new URLSearchParams(decryptedParams);

  const setUploadDocuments = useUploadDocuments();

  const imageType = "SELF_IMAGE";
  const checker =
    imageType === id ? CONSTANT.FILE_REGEX_IMAGE : CONSTANT.FILE_REGEX_DOC;

  const setupUploadFile = (file) => {
    if (checker.test(file.type) && file.size.match(/\d+/g)[0] < 1024) {
      setListingData({
        document_type: id,
        file: file.base64.split("base64,")[1]
      });
      setFileName(file.name);
    } else {
      setStatus({
        isError: true,
        isSuccess: false
      });
      setFileName("");
      setUploadData(id, true);
    }
  };

  useEffect(() => {
    if (notInitialRender.current) {
      setSpinnerActionDispatcher(true);
      if (params && params.has("orderId")) {
        const orderId = params.get("orderId");
        setUploadDocuments({
          variables: {
            order_id: orderId,
            ...listingData
          }
        }).then((res) => {
          if (res.data) {
            setStatus({
              isError: false,
              isSuccess:
                res.data &&
                res.data.uploadCustomerDocuments &&
                res.data.uploadCustomerDocuments.status
            });
            setUploadData(listingData.document_type);
            setSpinnerActionDispatcher(false);
          }
          if (res.errors) {
            setStatus({
              isError: true,
              isSuccess: false
            });
            setFileName("");
            setUploadData(listingData.document_type, true);
            setSpinnerActionDispatcher(false);
          }
        });
      }
    } else {
      notInitialRender.current = true;
    }
  }, [listingData]);

  return (
    <div className="vida-upload-card__container">
      <div className="vida-upload-card__title">{title}</div>
      <div
        className={`vida-upload-card__body ${
          status.isError ? "error" : status.isSuccess ? "success" : ""
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
          <div className="vida-upload-card__upload-file-upload">
            <span className="vida-upload-card__upload-file-upload-btn">
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
      {status.isError ? <p className="error">{error}</p> : ""}
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
    id: PropTypes.string
  }),
  messagesData: PropTypes.shape({
    error: PropTypes.string,
    success: PropTypes.string,
    fileFormatText: PropTypes.string
  }),
  setUploadData: PropTypes.func
};

export default UploadCards;
