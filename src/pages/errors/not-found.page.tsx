import BaseButton from "@/components/buttons/base-button.component"
import { selectCurrentUser } from "@/store/auth/auth.selector"
import { useSelector } from "react-redux"


const NotFoundPage = () => {

    const currentUser = useSelector(selectCurrentUser)

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col items-center justify-center py-4 gap-4">

                <h3 className="text-6xl md:text-7xl font-semibold text-red-400  text-center w-full my-6 ">404</h3>
                <h3 className="text-4xl md:text-5xl font-semibold text-dark-transparent  text-center w-full my-6">Oops! Page not found</h3>
                <p className="text-lg text-dark my-2 text-center">Sorry, it seems we took a wrong turn here ! </p>
                <div className="flex items-center justify-between w-fit gap-4 mx-auto px-6">
                    <BaseButton className="!text-xs" rounded={false} href="/">Back to Home</BaseButton>
                    {(currentUser.user && currentUser.profile) &&
                        <BaseButton className="!text-xs" rounded={false} href="/me/dashboard">Dashboard</BaseButton>
                    }
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage