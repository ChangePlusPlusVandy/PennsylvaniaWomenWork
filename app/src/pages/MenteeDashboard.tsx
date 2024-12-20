import React, { useState } from "react";
import Navbar from "../components/Navbar";

const MenteeDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Block Width--60 Margin-right--40 Margin-left--40 Margin-top--40 Height--100vh">
          <div className="Block-header Text-color--gray-600 Margin-bottom--20" style={{fontSize:"20px"}}>
            My courses
          </div>

          <div className="Flex-row Justify-content--spaceBetween">
            <div
              className="Card Card--noPadding Card-hover Margin-right--10"
              style={{ width: "215px" }}
            >
              <div
                className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8"
                style={{ height: "50px" }}
              ></div>
              <div className="Padding--10" style={{ height: "150px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">
                  Resume Workshop
                </h3>
                <p className="Text-fontSize--16 Text-color--gray-600">
                  Workshop content
                </p>
              </div>
            </div>

            <div
              className="Card Card--noPadding Card-hover Margin-right--10"
              style={{ width: "215px" }}
            >
              <div
                className="Background-color--green-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8"
                style={{ height: "50px" }}
              ></div>
              <div className="Padding--10" style={{ height: "150px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">
                  Resume Workshop
                </h3>
                <p className="Text-fontSize--16 Text-color--gray-600">
                  Workshop content
                </p>
              </div>
            </div>

            <div
              className="Card Card--noPadding Card-hover"
              style={{ width: "215px" }}
            >
              <div
                className="Background-color--blue-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8"
                style={{ height: "50px" }}
              ></div>
              <div className="Padding--10" style={{ height: "150px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">
                  Resume Workshop
                </h3>
                <p className="Text-fontSize--16 Text-color--gray-600">
                  Workshop content
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="Block Width--40 Margin-right--40 Margin-top--40 Height--100vh">
          <div className="Block-header Text-color--gray-1000 Margin-bottom--20" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '10px',textAlign:"center" }}>
            Upcoming Events!
          </div>
          <div className="Block-subtitle Margin-top--40" style={{borderBottom: '1px solid #e0e0e0', width: "50%"}}>
            June
          </div>

          <div className="Margin-top--20">
            <div className="Flex-row Margin-bottom--10">
              <div className="Margin-right--40" style={{ textAlign: 'center', width: '40px' }}>
                <div className="Text-color--gray-800">wed</div>
                <div className="Text-fontSize--30 Text-color--gray-1000">25</div>
              </div>
              <div>
                <div className="Text-fontSize--16 Text-color--gray-1000">
                  Mock Interview Session
                </div>
                <div className="Text-fontSize--14 Text-color--gray-800">
                  Practice your interview skills with an industry professional
                </div>
              </div>
            </div>
          </div>

          <div className="Margin-top--20">
            <div className="Flex-row Margin-bottom--10">
              <div className="Margin-right--40" style={{ textAlign: 'center', width: '40px' }}>
                <div className="Text-color--gray-800">wed</div>
                <div className="Text-fontSize--30 Text-color--gray-1000">25</div>
              </div>
              <div>
                <div className="Text-fontSize--16 Text-color--gray-1000">
                  Resume Workshop
                </div>
                <div className="Text-fontSize--14 Text-color--gray-800">
                  Develop your resume with a senior employee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeDashboard;
