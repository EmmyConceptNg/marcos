import Button from "../Button";
export function RoundMenu({ user, attacking, setType }) {
  return (
    <>
      {!user?.creditReport[0]?.round > 5 && (
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          loading={attacking}
          onClick={() => setType("disputing")}
        >
          {`Start Round ${user?.creditReport[0]?.round ? user?.creditReport[0]?.round + 1 : 1}`}
        </Button>
      )}
    </>
  );
}