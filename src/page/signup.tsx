import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import { SubmitIcon } from '../icons/SubmitIcon';

const RegisterPage = () => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {};
    const handleSubmit = async () => {
        // Handle form submission logic here
    };
    return (
        <>
            <div className="my-14 flex flex-col items-center bg-slate-200 dark:bg-slate-600 rounded-lg p-4 shadow-xl w-72 md:w-xl gap-4 text-black dark:text-slate-100">
                <h2 className="text-2xl font-medium">LOGIN</h2>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="outline-none border border-slate-500 p-3 rounded-lg w-full"
                    onChange={onChangeHandler}
                />
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="outline-none border border-slate-500 p-3 rounded-lg w-full"
                    onChange={onChangeHandler}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="outline-none border border-slate-500 p-3 rounded-lg w-full"
                    onChange={onChangeHandler}
                />
                <Button
                    variants="primary"
                    text="Regitser"
                    startIcon={<SubmitIcon />}
                    size="lg"
                    fullWidth={true}
                    // loading={loading}
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
};

export default LoginLayout(RegisterPage);
