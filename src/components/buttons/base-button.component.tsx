import { ReactNode } from "react"
import { Link } from "react-router-dom"

export enum buttonType {
  dark = "dark",
  light = "light",
  green = "green",
  blue = "blue",
  clear = "clear",
}

type BaseButtonProps = {
  className?: string,
  children: ReactNode,
  rounded?: boolean,
  disabled?:boolean,
  type?: buttonType,
  submitType?:'submit'|'reset'|'button'
  href?: string,
  clickHandler?: () => void
}


const BaseButton = ({ className = "", children, rounded = true,disabled, type = buttonType.blue, href, submitType="button", clickHandler = ()=>{}}: BaseButtonProps) => {

  const renderButton = () => {
    const classNameValue = `${className} w-fit flex items-center text-sm font-bold justify-center px-8 py-[0.5rem] select-none border-[1.5px] cursor-pointer ${disabled ? "cursor-not-allowed opacity-80":""}  ${rounded ? 'rounded-full' : 'rounded-lg'
      } ${type === buttonType.dark
        ? 'bg-black hover:bg-black/90 text-white border-black/90'
        : type === buttonType.clear
          ? 'bg-transparent border-black/80 text-black/80'
          :type === buttonType.green ? 'bg-green-500 hover:bg-green-500 text-white border-green-500'
          :type === buttonType.light ?'bg-white hover:bg-white/90 text-black border-white'
          : 'edu-button primary text-white'
      } transition duration-300`;

    return href ? (
      <Link className={classNameValue} to={href} onClick={clickHandler}>
        {children}
      </Link>
    ) : (
      <button className={classNameValue} type={submitType} onClick={clickHandler}>
        {children}
      </button>
    );
  };


  return (renderButton())
}

export default BaseButton