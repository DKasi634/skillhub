
// import { signInWithGoogle } from '@/utils/firebase/firebase.auth'
// import { useDispatch } from 'react-redux';
import { UserRole } from '@/api/types';
import BaseButton, { buttonType } from './base-button.component'
import { FcGoogle } from '@/assets'
import { supabaseGoogleSignIn } from '@/utils/supabase/supabase.auth';
// import { setErrorToast } from '@/store/toast/toast.actions';


type GoogleSigninButtonProps = {
    className?: string,
    accountType?: UserRole
}
const GoogleSigninButton = ({ className = "", accountType }: GoogleSigninButtonProps) => {
    // const dispatch = useDispatch();
    // const showError = (message: string) => {
    //     dispatch(setErrorToast(message))
    // }


    const continueWithGoogle = async () => {
        // if (!Object.values(UserRole).some(role => role === accountType)) {
        //     showError("You need to set an account type"); return
        // }else{
            await supabaseGoogleSignIn(accountType);
        // }
    }
    return (
        <BaseButton rounded={false} type={buttonType.green} clickHandler={continueWithGoogle}
            className={`${className} flex items-center justify-center !w-full !px-4 py-2 gap-2 text-sm font-medium `}
        >
            <FcGoogle className="h-5 w-5" />
            <span>Continuer avec Google</span>
        </BaseButton>
    )
}

export default GoogleSigninButton