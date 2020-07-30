import React from 'react';

export function WordListItem({ word, index, onEdit, onDelete }) {
  const { id, ja, en, es, fr, done } = word;
  return (
    <li>
      {index + 1}. {ja}, {en}, {es}, {fr}
      <span className="done-check">{done ? '✔' : ''}</span>
      <div className="item-buttons">
        <button className="small" onClick={onEdit} data-id={id}>
          編集
        </button>
        <button className="small" onClick={onDelete} data-id={id}>
          削除
        </button>
      </div>
    </li>
  );
}
