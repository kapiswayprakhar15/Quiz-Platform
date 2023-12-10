// QuizMainContent.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const QuizMainContent = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Fetch the HTML content dynamically
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch('/src/pages/Coding.html');
        console.log('Response status:', response.status);

        if (response.ok) {
          const html = await response.text();
          console.log('HTML content:', html);
          setHtmlContent(html);
        } else {
          console.error('Failed to fetch HTML content.');
        }
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      }
    };

    fetchHtmlContent();
  }, []);

  return (
    <div>
      <Helmet>
        <script src="../../../src/pages/code-runner-wc.js" defer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("load", (event) => {
                let btn = document.getElementById("options_menu");
                btn.addEventListener("change", (event) => {
                  var value = btn.value;
                  var text = btn.options[btn.selectedIndex].text;
                  let changeCodeRunnerDemo = document.getElementById("change_demo");
                  changeCodeRunnerDemo.outerHTML = \`<code-runner id="change_demo" language="\${text}"></code-runner>\`;
                });
              });
            `,
          }}
        />
      </Helmet>

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default QuizMainContent;
