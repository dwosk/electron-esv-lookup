import '../assets/css/Slider.scss';
import React from 'react';

const Slider = (props) => {
  let title = props.title
  return (
    <div class='menuItem'>
      <label class="switch">
        <input id='useFootnotes' type="checkbox"></input>
        <span class="slider round"></span>
      </label>
      <div class='sliderText'>{title}</div>
    </div>
  );
}

export default Slider;
