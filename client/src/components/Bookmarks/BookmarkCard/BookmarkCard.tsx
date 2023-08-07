import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Bookmark, Category } from '../../../interfaces';
import { actionCreators } from '../../../store';
import { State } from '../../../store/reducers';
import { iconParser, isImage, isSvg, isUrl, urlParser } from '../../../utility';
import { Icon } from '../../UI';
import classes from './BookmarkCard.module.css';

interface Props {
  category: Category;
  fromHomepage?: boolean;
}

export const BookmarkCard = (props: Props): JSX.Element => {
  const { category, fromHomepage = false } = props;
  const config = useSelector((state: State) => state.config.config);
  const isAuthenticated = useSelector((state: State) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const { setEditCategory } = bindActionCreators(actionCreators, dispatch);

  return (
    <div className={classes.BookmarkCard}>
      <h3
        className={
          fromHomepage || !isAuthenticated ? '' : classes.BookmarkHeader
        }
        onClick={() => {
          if (!fromHomepage && isAuthenticated) {
            setEditCategory(category);
          }
        }}
      >
        {category.name}
      </h3>

      <div className={classes.Bookmarks}>
        {category.bookmarks.map((bookmark: Bookmark) => {
          const redirectUrl = urlParser(bookmark.url)[1];

          let iconEl: JSX.Element = <Fragment></Fragment>;

          if (bookmark.icon) {
            const { icon, name } = bookmark;

            if (isImage(icon)) {
              const source = isUrl(icon) ? icon : `/uploads/${icon}`;

              iconEl = (
                <div className={classes.BookmarkIcon}>
                  <img
                    src={source}
                    alt={`${name} icon`}
                    className={classes.CustomIcon}
                  />
                </div>
              );
            } else if (isSvg(icon)) {
              const source = isUrl(icon) ? icon : `/uploads/${icon}`;

              iconEl = (
                <div className={classes.BookmarkIcon}>
                  <svg
                    data-src={source}
                    fill="var(--color-primary)"
                    className={classes.BookmarkIconSvg}
                  ></svg>
                </div>
              );
            } else {
              iconEl = (
                <div className={classes.BookmarkIcon}>
                  <Icon icon={iconParser(icon)} />
                </div>
              );
            }
          }

          return (
            <a
              href={redirectUrl}
              target={config.bookmarksSameTab ? '' : '_blank'}
              rel="noreferrer"
              key={`bookmark-${bookmark.id}`}
            >
              {bookmark.icon && iconEl}
              {bookmark.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};
