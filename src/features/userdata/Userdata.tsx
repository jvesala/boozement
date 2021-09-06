import './Userdata.css';
import { UserdataForm } from './UserdataForm';
import { PasswordForm } from './PasswordForm';

export const Userdata = () => {
    return (
        <div className="Userdata">
            <UserdataForm />
            <PasswordForm />
        </div>
    );
};
