import useReviewStore from '../store/reviewStore';

const ProductDetailsPage = () => {
  const { reviews, loading, error, fetchReviews, addReview } = useReviewStore();

  useEffect(() => {
    // Fetch reviews for the specific product
    fetchReviews(productId);
  }, [productId]);

  const handleSubmitReview = async () => {
    try {
      await addReview(productId, rating, reviewText);
      // Optionally show success message
    } catch (err) {
      // Handle error
    }
  };
};