
const ListingPreview = ({ post }) => (
  <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10">
    <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider">تمميز إعلان</span>
    <h3 className="text-lg font-bold">{post.title}</h3>
  </section>
);

export default ListingPreview;
