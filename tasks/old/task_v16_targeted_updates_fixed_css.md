# Agent Task

## Dry Run
false

## Git repo path
C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project

## Npm project path
C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project

## Branch name
feat/add-header-footer-and-more-social-cards

## Commit message
add header footer and two new social cards with targeted file actions

## Activities
1.
Type: insert_after_marker
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.js
Marker: import facebookIcon from "./assets/facebook-icon.svg";
Content:
import linkedinIcon from "./assets/linkedin-icon.svg";

2.
Type: insert_after_marker
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.js
Marker: import telegramIcon from "./assets/telegram-icon.svg";
Content:
import whatsappIcon from "./assets/whatsapp-icon.svg";

3.
Type: insert_before_marker
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.js
Marker: ];

function App() {
Content:
  {
    icon: whatsappIcon,
    title: "WHATSAPP",
    description:
      "5 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?",
  },
  {
    icon: linkedinIcon,
    title: "LINKEDIN",
    description:
      "6 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?",
  },

4.
Type: insert_after_marker
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.js
Marker:     <div className="app">
Content:
      <header className="appHeader">
        <span className="appLogo">IT</span>
      </header>

5.
Type: insert_after_marker
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.js
Marker:       </div>
Content:
      <footer className="appFooter" />

6.
Type: replace_entire_file
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.css
Content:
.app {
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  background: #efefef;
  box-sizing: border-box;
}

.cardsContainer {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  align-items: stretch;
  align-content: flex-start;
}

.socialCard {
  width: 260px;
  padding: 24px 20px 28px;
  border: 2px solid #222;
  background: #fff;
  text-align: center;
  box-sizing: border-box;
}

.socialIcon {
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
}

.socialTitle {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: 700;
}

.socialDescription {
  margin: 0 0 24px;
  font-size: 18px;
  line-height: 1.5;
}

.socialButton {
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 14px 16px;
  background: #000;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.appHeader {
  width: 100%;
  max-width: 1200px;
  background: #000;
  min-height: 72px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
}

.appLogo {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.appFooter {
  width: 100%;
  max-width: 1200px;
  background: #000;
  min-height: 56px;
}

7.
Type: replace_entire_file
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.test.js
Content:
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders six social cards with header and footer", () => {
  render(<App />);

  expect(screen.getAllByRole("button", { name: /read more/i })).toHaveLength(6);
  expect(screen.getByText("TWITTER")).toBeInTheDocument();
  expect(screen.getByText("FACEBOOK")).toBeInTheDocument();
  expect(screen.getByText("INSTAGRAM")).toBeInTheDocument();
  expect(screen.getByText("TELEGRAM")).toBeInTheDocument();
  expect(screen.getByText("WHATSAPP")).toBeInTheDocument();
  expect(screen.getByText("LINKEDIN")).toBeInTheDocument();
  expect(screen.getByText("IT")).toBeInTheDocument();
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
