import Link from "next/link";
import {
  BsFillCartCheckFill,
  BsFillPersonLinesFill,
  BsFillPersonBadgeFill,
  BsYoutube,
  BsQuestionSquareFill,
  BsMailbox2,
  BsBadgeAdFill,
  BsReceipt,
  BsClipboardData,
} from "react-icons/bs";
import { DiYeoman } from "react-icons/di";
import { FaUserTie } from "react-icons/fa";
import { RiDashboardFill, RiBuilding2Fill } from "react-icons/ri";
import { BsRocketTakeoffFill, BsLightningChargeFill } from "react-icons/bs";
import { classNames } from "@/utils/classNames";
export const Sidebar = ({ user, router, show, setShow, newCount }) => {
  return (
    <div
      className={`${show ? "-translate-x-0" : "translate-x-full"
        } fixed z-30 inset-y-0 right-0 w-60 transform bg-white shadow overflow-y-auto lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="mt-8 text-center relative w-20 h-20 lg:w-32 lg:h-32 m-auto">
        <img
          src={user?.profilePicture}
          className={classNames(
            "rounded-xl w-full h-full",
            user ? "block" : "none"
          )}
          alt=""
        />
      </div>
      <nav
        onClick={() => setShow(!show)}
        className="flex flex-col mt-16 text-slate-700"
      >
        <Link href={user ? `/admin/${user?._id}` : "#"}>
          <a
            className={classNames(
              "flex items-center px-4 py-2",
              router.pathname === "/admin/[adminId]" &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <RiDashboardFill size={18} />
            <span className="mx-4 font-medium tracking-wide">الرئيسية</span>
          </a>
        </Link>

        {/* <div
          className={classNames(
            "flex justify-between items-center",
            router.pathname.indexOf("/admin/posts/") !== -1 &&
              "bg-gray-50 text-orange-400"
          )}
        >
          </div> */}
        <Link href="/admin/posts/new-posts">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/posts/") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsBadgeAdFill size={18} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة الإعلانات
            </span>
          </a>
        </Link>
        {/* <Link href="/admin/reports/posts">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/reports/posts") !== -1 &&
                "bg-gray-50 text-orange-400"
            )}
          >
            <BsBadgeAdFill size={18} />
            <span className="mx-4 font-medium tracking-wide">
              تقارير الإعلانات
            </span>
          </a>
        </Link> */}
        <Link href="/admin/users/comp">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/users/comp") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <RiBuilding2Fill size={18} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة المكاتب
            </span>
          </a>
        </Link>
        <Link href="/admin/users/marketers">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/users/marketers") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <FaUserTie size={18} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة المسوقين
            </span>
          </a>
        </Link>

        <Link href="/admin/users/individual">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/users/individual") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <DiYeoman size={18} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة الافراد
            </span>
          </a>
        </Link>
        <Link href="/admin/packages">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/packages") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsFillCartCheckFill size={18} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة الباقات
            </span>
          </a>
        </Link>

        <Link href="/admin/tv">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/tv") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsYoutube size={20} />
            <span className="mx-4 font-medium tracking-wide">
              تلفزيون بوعقار
            </span>
          </a>
        </Link>

        <Link href="/admin/notifications">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/notifications") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsMailbox2 size={20} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة الإشعارات
            </span>
          </a>
        </Link>
        <Link href="/admin/marketing">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/marketing") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsMailbox2 size={20} />
            <span className="mx-4 font-medium tracking-wide">
              إدارة البنرات
            </span>
          </a>
        </Link>
        <Link href="/admin/boost-settings">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/boost-settings") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsRocketTakeoffFill size={18} />
            <span className="mx-4 font-medium tracking-wide">
              إعدادات الترويج
            </span>
          </a>
        </Link>

        <Link href="/admin/boost-orders">
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/boost-orders") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsLightningChargeFill size={18} />
            <span className="mx-4 font-medium tracking-wide flex items-center gap-2">
              طلبات البوست
              {newCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {newCount > 99 ? "99+" : newCount}
                </span>
              )}
            </span>
          </a>
        </Link>

        {(user?.type === "مدير عام" ||
          user?.type === "مدير العمليات والمحاسبة") && (
            <Link href="/admin/financial">
              <a
                className={classNames(
                  "flex items-center px-4 py-2 mt-2",
                  router.pathname.indexOf("/admin/financial") !== -1 &&
                  "bg-gray-50 text-orange-400"
                )}
              >
                <BsReceipt size={18} />
                <span className="mx-4 font-medium tracking-wide">
                  التقارير المالية
                </span>
              </a>
            </Link>
          )}
        {user?.type === "مدير عام" && (
          <>
            <Link href="/admin/coupons/packages">
              <a
                className={classNames(
                  "flex items-center px-4 py-2 mt-2",
                  router.pathname.indexOf("/admin/coupons/packages") !== -1 &&
                  "bg-gray-50 text-orange-400"
                )}
              >
                <BsFillPersonLinesFill size={18} />
                <span className="mx-4 font-medium tracking-wide">
                  إدارة الكوبونات
                </span>
              </a>
            </Link>
            <Link href="/admin/reports/posts">
              <a
                className={classNames(
                  "flex items-center px-4 py-2 mt-2",
                  router.pathname.indexOf("/admin/reports/posts") !== -1 &&
                  "bg-gray-50 text-orange-400"
                )}
              >
                <BsClipboardData size={18} />
                <span className="mx-4 font-medium tracking-wide">
                  تقارير بوعقار
                </span>
              </a>
            </Link>
            <Link href="/admin/users/roles">
              <a
                className={classNames(
                  "flex items-center px-4 py-2 mt-2",
                  router.pathname.indexOf("/admin/users/roles") !== -1 &&
                  "bg-gray-50 text-orange-400"
                )}
              >
                <BsFillPersonLinesFill size={18} />
                <span className="mx-4 font-medium tracking-wide">
                  إدارة مدراء المنصة
                </span>
              </a>
            </Link>
          </>
        )}
        <Link href={user ? `/admin/${user?._id}/profile` : "#"}>
          <a
            className={classNames(
              "flex items-center px-4 py-2 mt-2",
              router.pathname.indexOf("/admin/[adminId]/profile") !== -1 &&
              "bg-gray-50 text-orange-400"
            )}
          >
            <BsFillPersonBadgeFill size={18} />
            <span className="mx-4 font-medium tracking-wide">الملف الشخصي</span>
          </a>
        </Link>
        {(user?.type === "مدير عام" ||
          user?.type === "مدير العمليات والمحاسبة") && (
            <>
              <Link href="/admin/contact-us">
                <a
                  className={classNames(
                    "flex items-center px-4 py-2 mt-2",
                    router.pathname.indexOf("/admin/contact-us") !== -1 &&
                    "bg-gray-50 text-orange-400"
                  )}
                >
                  <BsMailbox2 size={18} />
                  <span className="mx-4 font-medium tracking-wide">
                    إدارة التواصل
                  </span>
                </a>
              </Link>
              <Link href="/admin/faqs">
                <a
                  className={classNames(
                    "flex items-center px-4 py-2 mt-2",
                    router.pathname.indexOf("/admin/faqs") !== -1 &&
                    "bg-gray-50 text-orange-400"
                  )}
                >
                  <BsQuestionSquareFill size={18} />
                  <span className="mx-4 font-medium tracking-wide">
                    الاسئلة الشائعة
                  </span>
                </a>
              </Link>
            </>
          )}
      </nav>
    </div>
  );
};
