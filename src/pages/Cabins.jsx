import { useEffect } from 'react';
import { getCabins } from '../services/apiCabins';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Cabins() {
  // testing DB
  useEffect(() => {
    getCabins().then(res => console.log(res));
  }, []);

  return (
    <Row type="horizontal">
      <Heading as="h1">All cabins</Heading>
      <p>TEST</p>
      <img
        src="https://fbkyxezsvtitdtsxgred.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg"
        alt="cabin-001"
      />
    </Row>
  );
}

export default Cabins;
