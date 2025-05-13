import styles from './CountryItem.module.css';
import { useCities } from '../contexts/CitiesContext';

function CountryItem({ country }) {
  const { flagemojiToPNG } = useCities();
  return (
    <li className={styles.countryItem}>
      <span className={styles.emoji}>{flagemojiToPNG(country.emoji)}</span>

      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
