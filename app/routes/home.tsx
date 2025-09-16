import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smark feedback for your dream job !" },
  ];
}

export default function Home() {
    const {isLoading, auth, kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);



    useEffect(() => {
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated ]);

    useEffect(() => {
         const loadResumes = async() =>{
             setLoadingResumes(true);

             const resumes = (await kv.list('resume:*', true)) as KVItem[];

             const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))
             console.log("parsedResumes", parsedResumes);
             setResumes(parsedResumes || []);
             setLoadingResumes(false);
         }

        loadResumes();

     }, []);

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">

      <Navbar />

      <section className="main-section">
          <div className="page-heading py-12">
              <h1>Track your Application & Resume Ratings</h1>
              {!loadingResumes && resumes.length === 0 ? (
                  <h2>No resumes found. Upload your resume  to get feedback.</h2>
              ):(
              <h2>Review your submissions and check AI-powered feedback.</h2>
              )}

              <div className="flex flex-row gap-3 mt-4">
                  <Link to="/auth" className="back-button">Sign Out</Link>
                  <Link to="/wipe" className="back-button">Wipe Data</Link>
              </div>

          </div>
          {loadingResumes && (
              <div className="flex flex-col gap-4 items-center justify-center">
                  <h2>Loading your resumes...</h2>
                  <img src="/images/resume-scan-2.gif" className="w-full" />
              </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
              <div className="resumes-section">
                  {resumes.map((resume) =>
                      <ResumeCard key={resume.id} resume={resume} />)}
              </div>
          )}

          {!loadingResumes && resumes.length === 0 && (
              <div className="flex flex-col gap-4 mt-10  items-center justify-center">
                  <Link to="/upload" className="primary-button w-fit text-xl font-semi-bold">
                      Upload Resume
                  </Link>
              </div>
          )}
      </section>




  </main>
}
