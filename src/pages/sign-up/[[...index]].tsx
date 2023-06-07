import { SignUp } from "@clerk/nextjs";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  const { t } = useTranslation("common");
  return (
    <div style={styles}>
      <p>{t("test")}</p>
      <SignUp />
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
