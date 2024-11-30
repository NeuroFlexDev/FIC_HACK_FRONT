import React from 'react';
import { v4 } from 'uuid';
import "./headerStyles.css"

const linksList = [
  { link: '/templates', title: 'Шаблоны' },
  { link: '/document-types', title: 'Типы документов' },
  { link: '/history', title: 'История' },
  { link: '/profile', title: 'Профиль' },
];

export const Header = () => {
  return (
    <header>
      <nav>
        <ul className='header-list'>
          {linksList.map((link) => (
            <li className="header-links" key={v4()}>
              <a href={link.link}>{link.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
