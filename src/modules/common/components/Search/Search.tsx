import styles from './Search.module.scss';
import cx from 'classnames';

interface SearchProps {
  className?: string;
}

const Search = ({ className }: SearchProps) => {
  return (
    <div className={cx(styles.search, className && styles[className])}>
      <button>
        <i className="icon-search" />
      </button>
      <input type="search" placeholder="Search..." />
    </div>
  );
};

export default Search;
