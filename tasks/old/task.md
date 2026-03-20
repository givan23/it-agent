# Agent Task

## Dry Run
false

## Git repo path
C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project

## Npm project path
C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project

## Branch name
feat/refactor-social-cards-list

## Commit message
refactor app to render social cards from mapped array

## Activities
1.
Type: replace_entire_file
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\components\Card.js
Content:
function Card({ icon, title, description }) {
return (
<div className="socialCard">
<img src={icon} alt={`${title} icon`} className="socialIcon" />
<h2 className="socialTitle">{title}</h2>
<p className="socialDescription">{description}</p>
<button className="socialButton">READ MORE</button>
</div>
);
}

export default Card;

2.
Type: replace_entire_file
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.js
Content:
import './App.css';
import Card from './components/Card';
import twitterIcon from './assets/twitter-icon.svg';
import facebookIcon from './assets/facebook-icon.svg';
import instagramIcon from './assets/instagram-icon.svg';
import telegramIcon from './assets/telegram-icon.svg';

const socialCards = [
{
icon: twitterIcon,
title: 'TWITTER',
description:
'1 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?'
},
{
icon: facebookIcon,
title: 'FACEBOOK',
description:
'2 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?'
},
{
icon: instagramIcon,
title: 'INSTAGRAM',
description:
'3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?'
},
{
icon: telegramIcon,
title: 'TELEGRAM',
description:
'4 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?'
}
];

function App() {
return (
<div className="app">
<div className="cardsContainer">
{socialCards.map((card) => (
<Card
key={card.title}
icon={card.icon}
title={card.title}
description={card.description}
/>
))}
</div>
</div>
);
}

export default App;

3.
Type: replace_entire_file
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.css
Content:
.app {
min-height: 100vh;
padding: 32px;
display: flex;
justify-content: center;
align-items: center;
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

4.
Type: replace_entire_file
Target: C:\Users\ivan.trabucco\repo\personal\agents\agent-test-project\test-project\src\App.test.js
Content:
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders four social cards', () => {
render(<App />);

expect(screen.getAllByRole('button', { name: /read more/i })).toHaveLength(4);
expect(screen.getByText('TWITTER')).toBeInTheDocument();
expect(screen.getByText('FACEBOOK')).toBeInTheDocument();
expect(screen.getByText('INSTAGRAM')).toBeInTheDocument();
expect(screen.getByText('TELEGRAM')).toBeInTheDocument();
});
