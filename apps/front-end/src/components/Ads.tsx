import React from "react"
import Grid from "@mui/material/Grid"
import { Slide } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"
import styled from "styled-components"
import ads from "./Img/DappChef_Ad.png"

const Adscontainer = styled.div`
  display: flex;
  align-items: space-around;
  justify-content: center;
  background-size: cover;
  background-position: "center center";
  direction: row;
  width: 100vw;
  height: 20vh;
  gap: 20px;
  zindex: 1000;
`

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // backgroundSize: "contain",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100%",
  width: "100%"
}

export const Slideshow = () => {
  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false
  }

  const images = [ads, ads, ads]

  return (
    <Slide>
      {images.map((img) => {
        return (
          <Adscontainer>
            {/* <div
              style={{
                ...divStyle,
                backgroundImage: `url(${images[0]})`,
                width: "100%"
              }}
            ></div> */}
            <img
              src={ads}
              alt=""
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain no-repeat",
                backgroundPosition: "center center",
                aspectRatio: 16 / 9
                // objectFit: "cover"
              }}
            />
          </Adscontainer>
        )
      })}
    </Slide>
  )
}

export default Slideshow
