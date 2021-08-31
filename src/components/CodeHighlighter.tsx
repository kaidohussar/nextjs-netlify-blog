import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import styles from "@styles/modules/codeHighlighter.module.scss";

type Props = {
  code: string;
  language: Language;
};

const CodeHighlighter = ({ code, language }: Props) => {
  return (
    <div className={styles.container}>
      <Highlight {...defaultProps} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeHighlighter;
