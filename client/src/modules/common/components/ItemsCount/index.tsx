import styles from './ItemsCount.module.scss';

interface ItemsCountProp {
  count: number | undefined;
  title?: string;
}

const ItemsCount = ({ count, title }: ItemsCountProp) => {
  return (
    <div className={styles.count}>
      <p>
        {title ? title : 'All Items'} {count ? <span>{count}</span> : null}
      </p>
    </div>
  );
};

export default ItemsCount;
