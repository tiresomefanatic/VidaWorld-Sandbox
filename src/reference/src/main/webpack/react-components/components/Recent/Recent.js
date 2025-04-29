import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import appUtils from "../../../site/scripts/utils/appUtils";
import { DateTime } from "luxon";
import Popup from "../Popup/Popup";
import axios from "axios";
import { RWebShare } from "react-web-share";

const Recent = (props) => {
  const [recentData, setRecentData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [videourl, setVideourl] = useState();

  async function getVideoData() {
    setSpinnerActionDispatcher(true);
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=` +
          props.recentConfig.videoid +
          `&key=` +
          appUtils.getConfig("YoutubeAPIKey")
      )
      .then((response) => {
        setSpinnerActionDispatcher(false);
        setRecentData(response.data.items);
      })
      .catch((error) => {
        setSpinnerActionDispatcher(false);
      });
  }
  useEffect(() => {
    getVideoData();
  }, [props.recentConfig.videoid]);

  const handlePopupClose = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setIsPopupOpen(false);
  };

  const handlePopupopen = (id) => {
    const url = `https://www.youtube.com/embed/${id}`;
    setVideourl(url);
    setIsPopupOpen(true);
  };

  return (
    <div className="vida-user-recents">
      <div className="vida-user-recents__container">
        {recentData.length > 0 && (
          <div className="vida-user-recents__title">
            <div>
              <h2 className="vida-user-recents__name">
                {props.recentConfig.title}
              </h2>
            </div>
            <div className="vida-user-recents__communitybody">
              <a
                className="vida-user-recents__communitytxt"
                href={props.recentConfig.comminitylink}
              >
                {props.recentConfig.communitytext}
              </a>
            </div>
          </div>
        )}
        <div className="vida-user-recents__body">
          {recentData.length > 0 &&
            recentData.map((item, index) => {
              return (
                <div className="vida-user-recents__articlebody" key={index}>
                  <a onClick={() => handlePopupopen(item.id)}>
                    <img
                      className="vida-user-recents__imgsize"
                      src={item.snippet.thumbnails.medium.url}
                      alt="Vida World"
                    />
                  </a>
                  <div className="vida-user-recents__content">
                    <div>
                      {}
                      <a onClick={() => handlePopupopen(item.id)}>
                        <p className="vida-user-recents__videoname">
                          {item.snippet.title}
                        </p>
                      </a>
                      <p className="vida-user-recents__by">
                        {" "}
                        By{" "}
                        <span className="vida-user-recents__channelname">
                          {item.snippet.channelTitle}
                        </span>
                      </p>
                      <div className="vida-user-recents__sharetime">
                        <div>
                          <span className="vida-user-recents__time">
                            {item.statistics?.viewCount}{" "}
                            {props.recentConfig?.views}
                          </span>
                          <span className="vida-user-recents__time">
                            {DateTime.fromISO(
                              item.snippet.publishedAt
                            ).toRelative()}
                          </span>
                        </div>
                        <div>
                          <RWebShare
                            data={{
                              text: item.snippet.description,
                              url: "https://www.youtube.com/watch?v=" + item.id,
                              title: item.snippet.title
                            }}
                            onClick={() => console.log("shared successfully!")}
                          >
                            <a className="vida-user-recents__icon icon-share"></a>
                          </RWebShare>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {isPopupOpen && (
            <Popup mode="medium" handlePopupClose={handlePopupClose}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={videourl}
              />
            </Popup>
          )}
          {recentData.length === 0 && (
            <div className="vida-user-long-test-rides__no-record">
              <h3>{props.recentConfig?.videonotfoundtxt}</h3>
              <h4>{props.recentConfig?.videonotfounddesctext}</h4>
            </div>
          )}
        </div>
        {recentData.length > 0 && (
          <div className="vida-user-recents__communitybodymobileview">
            <a
              className="vida-user-recents__communitytxt"
              href={props.recentConfig.comminitylink}
            >
              {props.recentConfig.communitytext}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

Recent.propTypes = {
  recentConfig: PropTypes.object
};

export default Recent;
