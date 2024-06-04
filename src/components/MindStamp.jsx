import useScript from "../hooks/useScript.js";
import { useCallback, useEffect, useState } from "react";
import { HiPlay } from "react-icons/hi";

export const MindStamp = (props) => {
  useScript('https://code.jquery.com/jquery-latest.min.js', false);
  useScript('https://mindstamp-resources.b-cdn.net/lity.min.js', false);

  const littyCleanup = () => {
    document.querySelectorAll('.lity').forEach((el) => {
      el.remove();
    });
    document.querySelectorAll('.lity-active').forEach((el) => {
      el.classList.remove('litty-active');
    });
    document.querySelectorAll('.litty-hidden').forEach((el) => {
      el.classList.remove('litty-hidden');
    });
  }

  const onMindStampClose = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    littyCleanup();
    props.onClose();
  }, [props]);

  useEffect(() => {
    let interval = setInterval(() => {
      document.querySelectorAll('.lity-close').forEach((el) => {
        el.addEventListener('click', onMindStampClose);
      });
    }, 200);
    return () => {
      clearInterval(interval);
      document.querySelectorAll('.lity-close').forEach((el) => {
        el.removeEventListener('click', onMindStampClose);
      });
    }
  }, []);

  const onMindstampClick = (event) => {
    event.preventDefault();
  }

  return (
    <a className={'w-full flex items-center justify-center min-h-screen h-full'} href="https://embed.mindstamp.com/e/toHxnwtfEnYD" data-lity onClick={onMindstampClick}>
      <span className={'sr-only'}>Play Video</span>
      <HiPlay className={`text-white text-9xl`} />
    </a>
  )
}