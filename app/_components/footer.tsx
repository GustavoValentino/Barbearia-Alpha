const Footer = () => {
  return (
    <div className="mt-12 w-full">
      <div className="flex w-full flex-col items-center gap-2.5 px-0 pt-10">
        <div className="bg-secondary flex w-full flex-col items-start justify-center gap-1.5 px-5 py-8 text-xs leading-none lg:items-center lg:text-center">
          <p className="text-foreground font-semibold">
            © 2025 Copyright Aparatus
          </p>
          <p className="text-muted-foreground font-normal">
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
