import {usePuterStore} from "~/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export const meta =() =>([
    {title: "Analyze | Auth"},
    {name: "description", content: "Log into your account"},
])

const   Auth= () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next, navigate]);


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 p-10 bg-white rounded-2xl">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <h1>Welcome</h1>
                        <h2>Sign In to Continue Your Job Search Journey</h2>
                    </div>

                    <div className="flex flex-row gap-3 mt-4 items-center justify-center" >
                        <Link to="/" className="back-button">Go to Home</Link>
                    </div>

                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Sign Out</p>
                                    </button>
                                ):
                                <button className="auth-button" onClick={auth.signIn}>
                                    <p>Sign In</p>
                                </button>}
                            </>


                        )}

                    </div>



                </section>


            </div>

        </main>

    );
};

export default  Auth;