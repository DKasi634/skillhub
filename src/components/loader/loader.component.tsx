import { LoaderSmWrapper } from "@/globals/styles"

type LoaderItemProps = {
    className?:string
}

const LoaderItem = ({className = ""}:LoaderItemProps) => {
  return (
    <LoaderSmWrapper className={`animate-spin ${className && className} w-[3rem] md:w-[3.5rem] aspect-square inline-block mx-auto rounded-full my-2`}/>
  )
}

export default LoaderItem