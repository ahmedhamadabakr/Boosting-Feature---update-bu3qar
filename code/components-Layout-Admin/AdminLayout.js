import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/user";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import dynamic from "next/dynamic";
import { fetcher } from "@/lib/fetch";
const DynamicHeader = dynamic(() =>
  import("./Header").then((mod) => mod.Header)
);

const AdminLayout = ({ children }) => {
  // states to handle showing of the dropDowns
  const [show, setShow] = useState(false);
  // function to get the useCurrentUser   ######Authorize
  const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isValidating) return;
    if (
      !user ||
      user.type === "company" ||
      user.type === "individual" ||
      user.type === "marketer"
    )
      router.replace("/");
  }, [user, router, isValidating]);

  // const [newCount, setNewCount] = useState(0);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetcher("/api/posts/check-new");
  //       setNewCount(res.newPosts?.count || 0);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // urgent pending boost count for sidebar badge
  const [urgentCount, setUrgentCount] = useState(0);
  useEffect(() => {
    if (!user) return;
    const fetchUrgent = async () => {
      try {
        const res = await fetcher("/api/admin/boost-items/stats");
        setUrgentCount(res?.stats?.urgentPending ?? 0);
      } catch { /* silent */ }
    };
    fetchUrgent();
  }, [user]);

  return (
    <div>
      <div className="flex min-h-screen">
        <div
          onClick={() => setShow(!show)}
          className={`${
            show ? "block" : "hidden"
          } fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden`}
        ></div>
        <Sidebar user={user} show={show} setShow={setShow} router={router} newCount={urgentCount} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DynamicHeader user={user} setShow={setShow} mutate={mutate} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto bg-gray-50 px-2">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
