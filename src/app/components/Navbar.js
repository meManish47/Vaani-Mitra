import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-2 z-40 sm:w-64 w-max h-screen "
      aria-label="Sidenav"
    >
      <div className="overflow-y-auto py-5 px-4 h-full bg-white border-r border-gray-200 dark:bg-white-800 dark:border-gray-700">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center p-3 font-bold text-xl text-black-900 rounded-lg dark:text-black hover:bg-red-100 dark:hover:bg-red-500 group"
            >
              <svg
                aria-hidden="true"
                className="w-7 h-7 text-red-500 transition duration-75 dark:text-red-500 group-hover:text-white-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-5 hidden sm:block">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user/characters"
              className="flex items-center p-3 font-bold text-xl text-black-900 rounded-lg dark:text-black hover:bg-red-100 dark:hover:bg-red-500 group"
            >
              <svg
                aria-hidden="true"
                className="w-7 h-7 text-red-500 transition duration-75 dark:text-red-500 group-hover:text-white-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 0 1 1 1v1h1a1 1 0 0 1 0 2h-1v2h1a1 1 0 0 1 0 2h-1v4h1a1 1 0 0 1 0 2h-1v1a4.992 4.992 0 0 1-9.56 1.5 1 1 0 0 1 1.92-.53A3 3 0 0 0 10 16a3 3 0 0 0 3-3v-1h-1a1 1 0 0 1 0-2h1V7h-1a1 1 0 0 1 0-2h1V5a2 2 0 0 0-2-2 1 1 0 0 1 0-2zM9 4v2H8a1 1 0 0 1 0-2h1zm1 12a1 1 0 0 1 0 2 3 3 0 0 0 0-6h-1v-4h1a1 1 0 0 1 0 2h-1v1a3 3 0 0 0-2.894 2.205A5 5 0 0 1 9 6a5 5 0 0 1 4.894 4.795A3 3 0 0 0 17 15v1h-1a1 1 0 0 1 0-2h1zM6 4a1 1 0 0 1 0 2H5V4h1z"
                ></path>
              </svg>

              <span className="ml-5  hidden sm:block">Characters</span>
            </Link>
          </li>
          {/* <li>
            <Link
              href="/user/leaderboard"
              className="flex items-center p-3 font-bold text-xl text-black-900 rounded-lg dark:text-black hover:bg-red-100 dark:hover:bg-red-500 group"
            >
              <svg
                aria-hidden="true"
                className="w-7 h-7 text-red-500 transition duration-75 dark:text-red-500 group-hover:text-white-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2zm1 3h10v2H4V5zm0 4h10v2H4V9zm0 4h10v2H4v-2zm13-9h-2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 10h-1V6h1v8zM15 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"></path>
              </svg>

              <span className="ml-5  hidden sm:block">Leaderboard</span>
            </Link>
          </li> */}
          <li>
            <Link
              href="/user/startquiz"
              className="flex items-center p-3 font-bold text-xl text-black-900 rounded-lg dark:text-black hover:bg-red-100 dark:hover:bg-red-500 group"
            >
              <svg
                aria-hidden="true"
                className="w-7 h-7 text-red-500 transition duration-75 dark:red-blue-500 group-hover:text-white-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 2a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0V2zm4 2a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0V4zm4-2a1 1 0 0 1 2 0v12a1 1 0 0 1-2 0V2zm4 4a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V6z"></path>
              </svg>

              <span className="ml-5  hidden sm:block">Quiz</span>
            </Link>
          </li>
          <li>
            <Link href={"/profile"}>
              <button
                type="button"
                className="flex items-center p-3 w-full text-xl font-bold text-black-900 rounded-lg transition duration-75 group hover:bg-red-100 dark:text-black dark:hover:bg-red-500"
                aria-controls="dropdown-pages"
                data-collapse-toggle="dropdown-pages"
              >
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 w-7 h-7 text-red-500 transition duration-75 group-hover:text-red-900 dark:text-red-500 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="flex-1 ml-5 text-left whitespace-nowrap  hidden sm:block">
                  Profile
                </span>
              </button>
            </Link>
          </li>
          <li>
            <Link href={"/user/settings"}>
              <button
                type="button"
                className="flex items-center p-3 w-full text-xl font-bold text-black-900 rounded-lg transition duration-75 group hover:bg-red-100 dark:text-black dark:hover:bg-red-500"
                aria-controls="dropdown-pages"
                data-collapse-toggle="dropdown-pages"
              >
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 w-7 h-7 text-red-500 transition duration-75 group-hover:text-red-900 dark:text-red-500 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 10a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zM10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>

                <span className="flex-1 ml-5 text-left whitespace-nowrap  hidden sm:block">
                  Settings
                </span>
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Navbar;
