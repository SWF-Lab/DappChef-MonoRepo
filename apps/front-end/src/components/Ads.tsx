import React from "react"
import { Slide } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"
import styled from "styled-components"

const Adscontainer = styled.div`
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
backgroundSize: 'cover',
height: '400px'
`

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "20vh"
}

export const Slideshow = () => {
  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false
  }

  const images = [
    "https://preview.redd.it/318okbrv9d051.jpg?width=640&crop=smart&auto=webp&s=76cc4f21a34a9a619e8fe3be9bb4072e87247e85",
    "https://ricedigital.co.uk/wp-content/uploads/2022/03/luxiemheader-850x480.jpg",
    "https://i.ytimg.com/vi/1CuvyeGDN5Q/mqdefault.jpg"
  ]

  return (
    <Slide>
      <Adscontainer>
        <div
          style={{ ...divStyle, backgroundImage: `url(${images[0]})` }}
        ></div>
      </Adscontainer>
      <div>
        <div
          style={{ ...divStyle, backgroundImage: `url(${images[1]})` }}
        ></div>
      </div>
      <div className="each-slide-effect">
        <div
          style={{ ...divStyle, backgroundImage: `url(${images[2]})` }}
        ></div>
      </div>
    </Slide>
  )
}

export default Slideshow
