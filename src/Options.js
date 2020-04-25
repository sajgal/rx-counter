import React, { useRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { IoIosCog } from 'react-icons/io'
import { RiCloseLine } from 'react-icons/ri'

import sound from './choir.m4a';

const SECONDS = 'seconds';
const MINUTES = 'minutes';

const visuallyHidden = css`
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px; width: 1px;
  margin: -1px; padding: 0; border: 0;
`;

const OptionsWrapper = styled.div`
  color: var(--color-white);
  width: 90%;
  display: grid;
  justify-self: center;
  margin-bottom: 90px;

  @media (min-width: 420px) {
    display: block;
    justify-self: right;
    width: 100%;
  }
`;

const OptionsControlls = styled.div`
  ${({ visible }) => !visible && visuallyHidden};
  margin-top: 20px;
  border-left: 1px solid var(--color-white);
  padding-left: 5px;
`;

const OptionsButton = styled.button`
  display: flex;
  justify-content: center;
  border: none;
  border-radius: 3px;
  box-shadow: 0px 0px 2px var(--color-green);
  background: var(--color-white);
  cursor: pointer;
  padding: 0 10px;
  height: 30px;
  font-size: 1.5em;

  &:hover {
    background: var(--color-green);
    color: var(--color-white);
  }
`;

const Label = styled.label`
  display: block;
`;

const PlayEveryValueInput = styled.input`
  margin: 5px 5px 7px 0;
  width: 40px;
`;

const Options = ({ start, end, duration }) => {
  const audioPlayer = useRef(null);
  const playEveryValueInputRef = useRef(null);
  const [isOptionBarVisible, setIsOptionBarVisible] = useState(false);
  const [playEveryValue, setPlayEveryValue] = useState(0);
  const [playEveryUnit, setPlayEveryUnit] = useState(SECONDS);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const onOptionsToggle = () => {
    setIsOptionBarVisible(!isOptionBarVisible);

    // Play and stop the audio playback in quick succession
    // to gain browser trust to play audio files
    if (!soundEnabled) {
      audioPlayer.current.play();
      audioPlayer.current.pause();
      audioPlayer.current.currentTime = 0;

      setSoundEnabled(true);
    }

    !isOptionBarVisible && playEveryValueInputRef.current.focus();
  }

  const onPlayEveryValueChange = (event) => {
    setPlayEveryValue(event.target.value);
  }

  const onPlayEveryUnitChange = (event) => {
    setPlayEveryUnit(event.target.value);
  }

  useEffect(() => {
    const getPlayEveryXSeconds = () => {
      return playEveryUnit === SECONDS ? playEveryValue : playEveryValue * 60;
    };

    if (
      soundEnabled
      && start //don't play if counter not running
      && !end //don't play if counter ended
      && duration.seconds > 0 //don't play at the beginning
    ) {
      // play sound when needed
      if (duration.seconds % getPlayEveryXSeconds() === 0) {
        audioPlayer.current.play();
      }

      // cancel playback before next loop
      // (if we want to play sound ever 2 seconds but audio file duration is 4 seconds)
      if (duration.seconds % getPlayEveryXSeconds() === getPlayEveryXSeconds() - 1) {
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0;
      }
    }
  }, [duration.seconds, end, playEveryUnit, playEveryValue, soundEnabled, start]);

  return (
    <OptionsWrapper>
      <OptionsButton onClick={onOptionsToggle}>
        {isOptionBarVisible ? <RiCloseLine /> : <IoIosCog />}
      </OptionsButton>
      <OptionsControlls visible={isOptionBarVisible}>
        <Label htmlFor="playEveryValue">Play sound every</Label>
        <PlayEveryValueInput
          type="text"
          id="playEveryValue"
          ref={playEveryValueInputRef}
          onChange={onPlayEveryValueChange}
          value={playEveryValue}
        />
        <select name="time-unit" id="time-unit" onChange={onPlayEveryUnitChange} value={playEveryUnit}>
          <option value={SECONDS}>second{playEveryValue > 1 ? 's' : ''}</option>
          <option value={MINUTES}>minute{playEveryValue > 1 ? 's' : ''}</option>
        </select>

        <audio ref={audioPlayer} src={sound} />
      </OptionsControlls>
    </OptionsWrapper>
  );
};

export default Options;