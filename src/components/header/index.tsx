import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";

export const Header = () => {
  const {
    locales = [],
    locale: activeLocale,
    pathname,
    query,
    asPath,
  } = useRouter();

  return (
    <div className="body-bold flex items-center text-6xl text-white">
      <div className="flex w-full items-start">
        <Link
          href="/"
          className="cursor-pointer bg-white p-4 text-xl text-red-900"
        >
          Home
        </Link>
        <Link
          href="/protected"
          className="cursor-pointer bg-white p-4 text-xl text-red-900"
        >
          Route with Chat
        </Link>
      </div>
      <ul className="body-bold flex w-full justify-end">
        {locales.map((locale) => {
          const styles =
            locale === activeLocale
              ? "mr-2 border bg-red-900 text-xl text-white "
              : "mr-2 border bg-white text-xl text-red-900";
          return (
            <li className={styles} key={locale}>
              <Link
                href={{ pathname, query }}
                as={asPath}
                locale={locale}
                legacyBehavior
              >
                {locale?.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
