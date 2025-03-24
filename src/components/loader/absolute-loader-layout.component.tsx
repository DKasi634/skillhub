import LoaderItem from "./loader.component"


const AbsoluteLoaderLayout = ({className=""}) => {
  return (
    <div className={`${className} absolute inset-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-40`}><LoaderItem className="!border-[0.2rem]"/></div>
  )
}

export default AbsoluteLoaderLayout