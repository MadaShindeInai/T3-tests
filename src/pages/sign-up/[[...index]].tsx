import { SignUp } from "@clerk/nextjs";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export const getStaticPaths = ({ locales }: GetStaticPathsContext) => {
  const paths = locales?.flatMap((locale) => [
    { params: { index: [""] }, locale },
  ]);
  return {
    paths,
    fallback: true,
  };
};

const SignUpPage = () => {
  const { locale = "en" } = useRouter();
  const path = locale === "en" ? "/sign-up" : `/${locale}/sign-up`;
  const { t } = useTranslation("common");
  return (
    <div style={styles}>
      <SignUp path={path} />
    </div>
  );
};

export default SignUpPage;

const styles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
